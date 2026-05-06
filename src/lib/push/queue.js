import IORedis from "ioredis";
import { Queue } from "bullmq";

export const PUSH_NOTIFICATION_QUEUE_NAME = "push-notifications";

function parseNumber(value, fallbackValue) {
  const parsedValue = Number.parseInt(String(value ?? ""), 10);

  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
}

function getRedisConnectionConfig() {
  const redisUrl =
    process.env.PUSH_QUEUE_REDIS_URL?.trim() || process.env.REDIS_URL?.trim();

  if (redisUrl) {
    return redisUrl;
  }

  return {
    host: process.env.REDIS_HOST?.trim() || "127.0.0.1",
    port: parseNumber(process.env.REDIS_PORT, 6379),
    password: process.env.REDIS_PASSWORD?.trim() || undefined,
    db: parseNumber(process.env.REDIS_DB, 0),
  };
}

function createRedisConnection() {
  const config = getRedisConnectionConfig();

  if (typeof config === "string") {
    return new IORedis(config, {
      maxRetriesPerRequest: null,
    });
  }

  return new IORedis({
    ...config,
    maxRetriesPerRequest: null,
  });
}

function normalizeQueuePriority(priority) {
  switch (priority) {
    case "high":
      return 1;
    case "low":
      return 10;
    default:
      return 5;
  }
}

export function getPushQueueConnection() {
  if (!globalThis.__pushQueueConnection) {
    globalThis.__pushQueueConnection = createRedisConnection();
  }

  return globalThis.__pushQueueConnection;
}

export function getPushNotificationQueue() {
  if (!globalThis.__pushNotificationQueue) {
    globalThis.__pushNotificationQueue = new Queue(
      PUSH_NOTIFICATION_QUEUE_NAME,
      {
        connection: getPushQueueConnection(),
      },
    );
  }

  return globalThis.__pushNotificationQueue;
}

export async function enqueuePushNotificationJob(jobPayload) {
  return getPushNotificationQueue().add("send-web-push", jobPayload, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 1000,
    removeOnFail: 1000,
    priority: normalizeQueuePriority(jobPayload?.notification?.priority),
  });
}
