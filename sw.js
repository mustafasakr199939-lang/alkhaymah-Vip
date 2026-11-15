"use strict";

const CACHE_NAME = "montaja-alkhaymah-vip-v4";
const APP_FILES = ["./", "./index.html", "./manifest.json", "./icon.svg"];

function scopedUrl(path) {
  return new URL(path, self.registration.scope).href;
}

function enhancePage(html) {
  if (html.includes("data-alkhaymah-gallery")) return html;

  const styles = `
    <style data-alkhaymah-gallery>
      html { scroll-padding-top: 110px; }
      .kh-gallery { margin:28px 0; padding:clamp(18px,3vw,30px); border:1px solid rgba(215,182,109,.55); border-radius:26px; background:linear-gradient(145deg,#fffdf8,#f2ead8); box-shadow:0 18px 40px rgba(19,41,34,.12); }
      .kh-gallery h2 { margin:0 0 6px; color:#183c32; font-size:clamp(1.5rem,3vw,2.25rem); }
      .kh-gallery-lead { margin:0 0 18px; color:#5e6d66; }
      .kh-photo-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; }
      .kh-photo-card { overflow:hidden; min-width:0; border:1px solid rgba(215,182,109,.45); border-radius:18px; background:#fff; box-shadow:0 10px 24px rgba(24,60,50,.09); }
      .kh-photo-card img { display:block; width:100%; height:220px; object-fit:cover; background:#e9dfc9; }
      .kh-photo-card figcaption { padding:11px 13px; color:#183c32; font-weight:800; }
      .kh-menu-title { margin:26px 0 12px; color:#183c32; font-size:1.35rem; }
      .kh-menu-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; }
      .kh-menu-card img { height:170px; }
      .kh-menu-card figcaption { display:flex; justify-content:space-between; gap:8px; }
      .kh-menu-card figcaption span:last-child { color:#9a7025; white-space:nowrap; }
      @media(max-width:850px) { .kh-photo-grid,.kh-menu-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
      @media(max-width:520px) { .kh-photo-grid,.kh-menu-grid { grid-template-columns:1fr; } .kh-photo-card img,.kh-menu-card img { height:230px; } }
    </style>`;

  const photo = (url, alt, label, menu = false) => `<figure class="kh-photo-card${menu ? " kh-menu-card" : ""}"><img loading="lazy" decoding="async" src="${url}" alt="${alt}" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&amp;fit=crop&amp;w=1200&amp;q=80';"><figcaption>${label}</figcaption></figure>`;
  const gallery = `
    <section class="kh-gallery" id="gallery" aria-labelledby="galleryTitle">
      <h2 id="galleryTitle">صور من أجواء الخيمة وضيافتها</h2>
      <p class="kh-gallery-lead">جلسات دافئة ومذاقات شرقية أصيلة، في أجواء صُممت لتجمع الأحباب.</p>
      <div class="kh-photo-grid">
        ${photo("https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&amp;fit=crop&amp;w=1200&amp;q=85", "جلسة خيمة مضاءة في أجواء ليلية دافئة", "جلسات الخيمة الفاخرة")}
        ${photo("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&amp;fit=crop&amp;w=1200&amp;q=85", "مشويات شهية على الفحم", "مشويات على الفحم")}
        ${photo("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&amp;fit=crop&amp;w=1200&amp;q=85", "طبق شرقي غني بالمذاقات", "أطباق شرقية مختارة")}
        ${photo("https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&amp;fit=crop&amp;w=1200&amp;q=85", "قهوة ساخنة تقدم للضيوف", "قهوة الضيافة")}
      </div>
      <h3 class="kh-menu-title">من قائمة الضيافة</h3>
      <div class="kh-menu-grid">
        ${photo("https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&amp;fit=crop&amp;w=1200&amp;q=85", "كباب وكفتة مشوية", "كباب وكفتة", true)}
        ${photo("https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&amp;fit=crop&amp;w=1200&amp;q=85", "طاجن شرقي ومقبلات", "طواجن ومقبلات", true)}
        ${photo("https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&amp;fit=crop&amp;w=1200&amp;q=85", "حلويات شرقية شهية", "حلويات شرقية", true)}
        ${photo("https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&amp;fit=crop&amp;w=1200&amp;q=85", "شاي ساخن للضيافة", "شاي على الجمر", true)}
      </div>
    </section>`;

  let result = html.replace("</style>", styles + "\n</style>");
  const heroStart = result.indexOf('<section class="hero"');
  if (heroStart !== -1) {
    const heroEnd = result.indexOf("</section>", heroStart);
    if (heroEnd !== -1) {
      const insertAt = heroEnd + "</section>".length;
      result = result.slice(0, insertAt) + "\n" + gallery + "\n" + result.slice(insertAt);
    }
  }

  // Repair a naked JavaScript tail if an earlier edit left it outside a script element.
  const footerAt = result.indexOf("</footer>");
  if (footerAt !== -1) {
    const tailStart = result.search(/(?:printWindow\.document\.close\(\)|function inviteFriends\s*\()/g);
    if (tailStart > footerAt) {
      const precedingOpen = result.lastIndexOf("<script", tailStart);
      const precedingClose = result.lastIndexOf("</script>", tailStart);
      if (precedingClose > precedingOpen) {
        result = result.slice(0, tailStart) + "<script>\n" + result.slice(tailStart);
        const bodyClose = result.lastIndexOf("</body>");
        if (bodyClose !== -1) result = result.slice(0, bodyClose) + "</script>\n" + result.slice(bodyClose);
      }
    }
  }

  // Keep the site's interface entirely in Arabic without changing its identifiers or behavior.
  result = result.replaceAll("Club Experience", "تجربة الضيافة").replaceAll("VIP", "النخبة");
  return result;
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
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  const scopeUrl = new URL(self.registration.scope);
  if (requestUrl.origin !== scopeUrl.origin || !requestUrl.href.startsWith(self.registration.scope)) return;

  const indexUrl = scopedUrl("./index.html");
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(async response => {
        if (!response || !response.ok) return response;
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("text/html")) return response;

        const html = enhancePage(await response.clone().text());
        const headers = new Headers(response.headers);
        headers.delete("content-length");
        const enhancedResponse = new Response(html, { status: response.status, statusText: response.statusText, headers });
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, enhancedResponse.clone());
        await cache.put(indexUrl, enhancedResponse.clone());
        return enhancedResponse;
      }).catch(async () => {
        const cachedPage = await caches.match(request);
        return cachedPage || caches.match(indexUrl);
      })
    );
    return;
  }

  event.respondWith(caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    });
  }));
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

    const openClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of openClients) {
      if (client.url.startsWith(self.registration.scope)) {
        if ("navigate" in client) await client.navigate(targetUrl);
        return client.focus();
      }
    }
    await clients.openWindow(targetUrl);
  })());
});
