/* eslint-disable @typescript-eslint/no-require-imports */
const { loadEnvConfig } = require("@next/env");
const mongoose = require("mongoose");
const webpush = require("web-push");
const { Worker } = require("bullmq");
const createRedisConnection = require("../src/lib/push/queue.js");

loadEnvConfig(process.cwd());

const PUSH_NOTIFICATION_QUEUE_NAME = "push-notifications";
const PUSH_SUBSCRIPTIONS_COLLECTION = "push_subscriptions";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseNumber(value, fallbackValue) {
  const parsedValue = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
}

async function connectMongo() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = normalizeText(process.env.NEXT_PUBLIC_MONGODB_URI);

  if (!mongoUri) {
    throw new Error("Missing NEXT_PUBLIC_MONGODB_URI");
  }

  await mongoose.connect(mongoUri, {
    dbName: "SantumAI",
  });
}

function configureWebPush() {
  const vapidPublicKey = normalizeText(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  );
  const vapidPrivateKey = normalizeText(process.env.VAPID_PRIVATE_KEY);

  if (!vapidPublicKey || !vapidPrivateKey) {
    throw new Error("Missing VAPID keys");
  }

  webpush.setVapidDetails(
    normalizeText(process.env.VAPID_CONTACT_EMAIL) || "mailto:test@test.com",
    vapidPublicKey,
    vapidPrivateKey,
  );
}

function chunkRecords(records, size) {
  const chunks = [];

  for (let index = 0; index < records.length; index += size) {
    chunks.push(records.slice(index, index + size));
  }

  return chunks;
}

function normalizeUsers(value) {
  const values = Array.isArray(value) ? value : [];

  return [...new Set(values.map(normalizeText).filter(Boolean))];
}

function buildPushPayload(notification) {
  const title = normalizeText(notification?.title) || "SantumAI";
  const body =
    normalizeText(notification?.body) || "You have a new notification.";
  const url = normalizeText(notification?.url) || "/notifications";
  const icon =
    normalizeText(notification?.icon) ||
    "/Logo Source files 21-4/Icon/0.5x/Artboard1.png";
  const badge =
    normalizeText(notification?.badge) ||
    "/Logo Source files 21-4/Icon/0.5x/Artboard1.png";
  const tag = normalizeText(notification?.tag) || undefined;
  const data =
    notification?.data && typeof notification.data === "object"
      ? notification.data
      : {};

  return {
    title,
    body,
    url,
    icon,
    badge,
    tag,
    data: {
      ...data,
      url,
    },
  };
}

function getPushUrgency(priority) {
  switch (priority) {
    case "high":
      return "high";
    case "low":
      return "low";
    default:
      return "normal";
  }
}

async function updateSubscriptionRecord(collection, id, updates) {
  await collection.updateOne(
    { _id: id },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
  );
}

async function deactivateSubscription(collection, id, message) {
  await collection.updateOne(
    { _id: id },
    {
      $set: {
        isActive: false,
        lastError: normalizeText(message),
        deactivatedAt: new Date(),
        updatedAt: new Date(),
      },
    },
  );
}

async function sendSubscriptionBatch(collection, records, notification) {
  const payload = JSON.stringify(buildPushPayload(notification));
  const results = await Promise.allSettled(
    records.map(async (record) => {
      const subscription = {
        endpoint: record.endpoint,
        expirationTime:
          typeof record.expirationTime === "number"
            ? record.expirationTime
            : null,
        keys: {
          p256dh: record.keys?.p256dh,
          auth: record.keys?.auth,
        },
      };

      try {
        await webpush.sendNotification(subscription, payload, {
          TTL: 60,
          urgency: getPushUrgency(notification?.priority),
        });

        await updateSubscriptionRecord(collection, record._id, {
          isActive: true,
          lastError: "",
          lastSentAt: new Date(),
          deactivatedAt: null,
        });

        return { status: "sent" };
      } catch (error) {
        const message =
          normalizeText(error?.body) ||
          normalizeText(error?.message) ||
          "Push send failed";

        if (error?.statusCode === 404 || error?.statusCode === 410) {
          await deactivateSubscription(collection, record._id, message);
          return { status: "deactivated" };
        }

        await updateSubscriptionRecord(collection, record._id, {
          lastError: message,
        });

        return { status: "failed" };
      }
    }),
  );

  return results.reduce(
    (summary, result) => {
      if (result.status !== "fulfilled") {
        summary.failed += 1;
        return summary;
      }

      if (result.value.status === "sent") {
        summary.sent += 1;
      } else if (result.value.status === "deactivated") {
        summary.deactivated += 1;
      } else {
        summary.failed += 1;
      }

      return summary;
    },
    { sent: 0, failed: 0, deactivated: 0 },
  );
}

async function processPushJob(job) {
  const users = normalizeUsers(job.data?.users);

  if (users.length === 0) {
    return { sent: 0, failed: 0, deactivated: 0, skipped: true };
  }

  await connectMongo();
  const collection = mongoose.connection.collection(
    PUSH_SUBSCRIPTIONS_COLLECTION,
  );
  const subscriptions = await collection
    .find({
      user: { $in: users },
      isActive: true,
    })
    .toArray();

  if (subscriptions.length === 0) {
    return { sent: 0, failed: 0, deactivated: 0, skipped: true };
  }

  const batches = chunkRecords(subscriptions, 50);
  const totals = {
    sent: 0,
    failed: 0,
    deactivated: 0,
  };

  for (const batch of batches) {
    const batchTotals = await sendSubscriptionBatch(
      collection,
      batch,
      job.data?.notification,
    );

    totals.sent += batchTotals.sent;
    totals.failed += batchTotals.failed;
    totals.deactivated += batchTotals.deactivated;
  }

  return totals;
}

async function startWorker() {
  configureWebPush();
  const connection = createRedisConnection();
  const worker = new Worker(PUSH_NOTIFICATION_QUEUE_NAME, processPushJob, {
    connection,
    concurrency: parseNumber(process.env.PUSH_WORKER_CONCURRENCY, 5),
  });

  worker.on("ready", () => {
    console.log("[push-worker] ready");
  });

  worker.on("completed", (job, result) => {
    console.log("[push-worker] completed", job.id, result);
  });

  worker.on("failed", (job, error) => {
    console.error("[push-worker] failed", job?.id, error);
  });

  worker.on("error", (error) => {
    console.error("[push-worker] worker error", error);
  });

  const shutdown = async () => {
    await worker.close();
    await connection.quit();
    await mongoose.disconnect();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startWorker().catch((error) => {
  console.error("[push-worker] unable to start", error);
  process.exit(1);
});
