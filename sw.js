"use strict";

const CACHE_NAME = "montaja-alkhaymah-vip-v5";
const APP_FILES = ["./", "./index.html", "./manifest.json", "./icon.svg"];

function scopedUrl(path) {
  return new URL(path, self.registration.scope).href;
}

function enhancePage(html) {
  if (html.includes("data-alkhaymah-gallery")) return html;

  const styles = `
    <style data-alkhaymah-gallery>
      html { scroll-padding-top: 110px; }
      .kh-gallery { grid-column:1 / -1; margin:0; padding:clamp(18px,3vw,30px); border:1px solid rgba(215,182,109,.55); border-radius:26px; background:linear-gradient(145deg,#fffdf8,#f2ead8); box-shadow:0 18px 40px rgba(19,41,34,.10); }
      .kh-gallery h2 { margin:0 0 6px; color:#183c32; font-size:clamp(1.5rem,3vw,2.25rem); }
      .kh-gallery-lead { margin:0 0 18px; color:#5e6d66; }
      .kh-photo-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; }
      .kh-photo-card { overflow:hidden; min-width:0; margin:0; border:1px solid rgba(215,182,109,.55); border-radius:18px; background:#fff; box-shadow:0 10px 24px rgba(24,60,50,.09); }
      .kh-photo-button { display:block; width:100%; padding:0; border:0; background:#e9dfc9; cursor:zoom-in; }
      .kh-photo-card img { display:block; width:100%; height:220px; object-fit:cover; }
      .kh-photo-card figcaption { padding:11px 13px; color:#183c32; font-weight:800; }
      .kh-lightbox { position:fixed; inset:0; z-index:1000; display:grid; place-items:center; padding:24px; background:rgba(9,14,12,.92); }
      .kh-lightbox[hidden] { display:none; }
      .kh-lightbox img { display:block; max-width:min(94vw,1400px); max-height:86vh; width:auto; height:auto; object-fit:contain; border:2px solid rgba(215,182,109,.85); border-radius:12px; box-shadow:0 20px 70px rgba(0,0,0,.45); }
      .kh-lightbox-close { position:absolute; top:14px; inset-inline-end:18px; width:48px; height:48px; border:1px solid rgba(241,217,162,.7); border-radius:50%; color:#fff; background:rgba(24,60,50,.9); font-size:1.8rem; cursor:pointer; }
      .kh-lightbox-caption { position:absolute; bottom:14px; max-width:90vw; color:#fff; text-align:center; text-shadow:0 2px 8px #000; }
      @media(max-width:850px) { .kh-photo-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
      @media(max-width:520px) { .kh-photo-grid { grid-template-columns:1fr; } .kh-photo-card img { height:230px; } .kh-lightbox { padding:12px; } }
    </style>`;

  const photos = [
    ["food1.jpg", "مائدة الضيافة والأطباق الشرقية", "مائدة الضيافة"],
    ["food2.jpg", "تشكيلة مشويات من مطبخ الخيمة", "مشويات الخيمة"],
    ["place1.jpg", "أجواء الجلسات الخارجية في المنتجع", "أجواء المنتجع"],
    ["menu1.jpg", "قائمة الضيافة في منتجع الخيمة", "قائمة الضيافة"]
  ];
  const cards = photos.map(([src, alt, label]) => `
        <figure class="kh-photo-card">
          <button class="kh-photo-button" type="button" aria-label="تكبير الصورة: ${label}">
            <img loading="lazy" decoding="async" src="./${src}" alt="${alt}">
          </button>
          <figcaption>${label}</figcaption>
        </figure>`).join("");
  const gallery = `
    <section class="kh-gallery" id="gallery" aria-labelledby="galleryTitle">
      <h2 id="galleryTitle">أجواء المنتجع وقائمة الضيافة</h2>
      <p class="kh-gallery-lead">اكتشف أطباقنا وأجواء جلساتنا، واضغط على أي صورة لمشاهدتها بوضوح.</p>
      <div class="kh-photo-grid">${cards}
      </div>
    </section>
    <div class="kh-lightbox" id="khLightbox" role="dialog" aria-modal="true" aria-label="عرض الصورة" hidden>
      <button class="kh-lightbox-close" type="button" aria-label="إغلاق الصورة">×</button>
      <img alt="" src="">
      <div class="kh-lightbox-caption" aria-live="polite"></div>
    </div>`;
  const lightboxScript = `
    <script data-alkhaymah-gallery>
      (() => {
        const modal = document.getElementById("khLightbox");
        if (!modal) return;
        const image = modal.querySelector("img");
        const caption = modal.querySelector(".kh-lightbox-caption");
        const closeButton = modal.querySelector(".kh-lightbox-close");
        let lastTrigger = null;
        const close = () => {
          modal.hidden = true;
          document.body.style.overflow = "";
          if (lastTrigger) lastTrigger.focus();
        };
        document.querySelectorAll(".kh-photo-button").forEach(button => {
          button.addEventListener("click", () => {
            const thumb = button.querySelector("img");
            lastTrigger = button;
            image.src = thumb.currentSrc || thumb.src;
            image.alt = thumb.alt;
            caption.textContent = thumb.closest("figure").querySelector("figcaption").textContent;
            modal.hidden = false;
            document.body.style.overflow = "hidden";
            closeButton.focus();
          });
        });
        closeButton.addEventListener("click", close);
        modal.addEventListener("click", event => { if (event.target === modal) close(); });
        document.addEventListener("keydown", event => {
          if (!modal.hidden && event.key === "Escape") close();
        });
      })();
    </script>`;

  let result = html.replace("</style>", styles + "\n</style>");
  result = result.replace(
    /<div class="note">[\s\S]*?<\/div>/,
    '<div class="note">تُحفظ بطاقتك تلقائياً على جهازك.</div>'
  );
  result = result.replace("عائلة من الرياض", "ضيوف من المنيا");
  result = result.replace(/<div class="map-box">[\s\S]*?<\/div>/, "");

  const bookingMarker = '<section class="panel" id="booking"';
  const bookingAt = result.indexOf(bookingMarker);
  if (bookingAt !== -1) result = result.slice(0, bookingAt) + gallery + "\n      " + result.slice(bookingAt);
  result = result.replace("</body>", lightboxScript + "\n</body>");

  // Keep the site's existing Arabic presentation substitutions.
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
