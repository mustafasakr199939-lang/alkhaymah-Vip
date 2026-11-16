"use strict";

const CACHE_NAME = "alkhaymah-vip-v4";
const APP_FILES = ["./", "./index.html", "./manifest.json", "./icon.svg", "./vip-enhancements.js"];
const SCRIPT_TAG = '<script src="./vip-enhancements.js" defer></script>';

async function addEnhancements(response) {
  if (!response || !response.ok) return response;
  let html = await response.text();
  if (!html.includes("vip-enhancements.js")) html = html.replace(/<\/body>/i, `${SCRIPT_TAG}\n</body>`);
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
}

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(async cache => {
    await cache.addAll(APP_FILES);
    const enhanced = await addEnhancements(await fetch("./index.html", { cache: "no-cache" }));
    if (enhanced && enhanced.ok) {
      await cache.put("./index.html", enhanced.clone());
      await cache.put("./", enhanced.clone());
    }
  }).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(async response => {
      const enhanced = await addEnhancements(response);
      if (enhanced && enhanced.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, enhanced.clone()));
      return enhanced;
    }).catch(() => caches.match(request).then(cached => cached || caches.match("./index.html"))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  })));
});
