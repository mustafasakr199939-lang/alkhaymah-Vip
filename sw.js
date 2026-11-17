"use strict";

const CACHE_NAME = "alkhaymah-vip-v5";
const APP_FILES = [
  "./",
  "./index.html",
  "./wallet.html",
  "./manifest.json",
  "./icon.svg",
  "./vip-enhancements.js"
];
const SCRIPT_TAG = '<script src="./vip-enhancements.js" defer></script>';
const APP_ORIGIN = self.location.origin;

async function addEnhancements(response) {
  if (!response || !response.ok) return response;
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  let html = await response.text();
  if (!html.includes("vip-enhancements.js")) {
    html = html.replace(/<\/body>/i, `${SCRIPT_TAG}\n</body>`);
  }
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");
  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_FILES);
    const response = await fetch("./index.html", { cache: "no-cache" });
    const enhanced = await addEnhancements(response);
    if (enhanced && enhanced.ok) {
      await cache.put("./index.html", enhanced.clone());
      await cache.put("./", enhanced.clone());
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith("alkhaymah-vip-") && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== APP_ORIGIN) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        const enhanced = url.pathname.endsWith("/wallet.html")
          ? response
          : await addEnhancements(response);
        if (enhanced && enhanced.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, enhanced.clone());
        }
        return enhanced;
      } catch {
        return (await caches.match(request))
          || (url.pathname.endsWith("/wallet.html") && await caches.match("./wallet.html"))
          || await caches.match("./index.html")
          || Response.error();
      }
    })());
    return;
  }

  // Only cache known app files; avoid retaining arbitrary same-origin responses.
  const isAppFile = APP_FILES.some(path => {
    const appUrl = new URL(path, self.location.href);
    return appUrl.pathname === url.pathname;
  });
  if (!isAppFile) return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  })());
});
