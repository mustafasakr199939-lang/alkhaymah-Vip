"use strict";

const CACHE_NAME = "montaja-alkhaymah-vip-v1";
const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg"
];

function scopedUrl(path) {
  return new URL(path, self.registration.scope).href;
}

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES.map(scopedUrl)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);

  // لا نعترض ملفات المواقع الخارجية، مثل واتساب أو مكتبة QR.
  if (requestUrl.origin !== scopeUrl.origin) return;
  if (!requestUrl.href.startsWith(self.registration.scope)) return;

  const indexUrl = scopedUrl("./index.html");

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const responseCopy = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseCopy);
              cache.put(indexUrl, response.clone());
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          return cachedPage || caches.match(indexUrl);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        if (response && response.ok) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseCopy));
        }
        return response;
      });
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const data = event.notification.data || {};
  let targetUrl = data.url || self.registration.scope;

  if (event.action === "invite" && data.inviteUrl) {
    targetUrl = data.inviteUrl;
  } else if (event.action === "book") {
    const baseUrl = new URL(data.url || self.registration.scope);
    baseUrl.hash = "booking";
    targetUrl = baseUrl.href;
  }

  event.waitUntil((async () => {
    if (event.action === "invite") {
      await clients.openWindow(targetUrl);
      return;
    }

    const openClients = await clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    for (const client of openClients) {
      if (client.url.startsWith(self.registration.scope)) {
        if ("navigate" in client) await client.navigate(targetUrl);
        return client.focus();
      }
    }

    await clients.openWindow(targetUrl);
  })());
});
