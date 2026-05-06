self.__WB_DISABLE_DEV_LOGS = true;

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const url =
    typeof data?.url === "string" && data.url.trim()
      ? data.url.trim()
      : "/notifications";

  event.waitUntil(
    self.registration.showNotification(data.title || "SantumAI", {
      body: data.body || "You have a new notification.",
      icon: data.icon || "/Logo Source files 21-4/Icon/0.5x/Artboard1.png",
      badge: data.badge || "/Logo Source files 21-4/Icon/0.5x/Artboard1.png",
      tag: data.tag || undefined,
      data: {
        ...((data.data && typeof data.data === "object") ? data.data : {}),
        url,
      },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url =
    typeof event.notification.data?.url === "string" &&
    event.notification.data.url.trim()
      ? event.notification.data.url.trim()
      : "/notifications";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }

        return undefined;
      }),
  );
});
