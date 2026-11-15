"use strict";

const CACHE_NAME = "montaja-alkhaymah-vip-v6";
const APP_FILES = ["./", "./index.html", "./manifest.json", "./icon.svg"];

function scopedUrl(path) {
  return new URL(path, self.registration.scope).href;
}

function enhancePage(html) {
  if (html.includes("data-alkhaymah-gallery")) return html;

  const styles = `
    <style data-alkhaymah-gallery>
      html { scroll-padding-top: 110px; }
      .kh-gallery { grid-column:1 / -1; position:relative; isolation:isolate; overflow:hidden; margin:0; padding:clamp(20px,4vw,38px); border:1px solid rgba(215,182,109,.72); border-radius:28px; background:radial-gradient(ellipse at 10% 0%,rgba(215,182,109,.16),transparent 40%),linear-gradient(145deg,#173b31,#102820 68%,#291b14); box-shadow:0 24px 55px rgba(19,41,34,.22); }
      .kh-gallery::before { content:""; position:absolute; inset:12px; z-index:-1; border:1px solid rgba(241,217,162,.2); border-radius:20px; pointer-events:none; }
      .kh-gallery-head { margin:0 0 24px; text-align:center; }
      .kh-gallery-kicker { display:inline-block; margin-bottom:8px; padding:5px 14px; border:1px solid rgba(215,182,109,.62); border-radius:999px; color:#f1d9a2; font-size:.78rem; font-weight:800; letter-spacing:.04em; }
      .kh-gallery h2 { margin:0; color:#f1d9a2; font-size:clamp(1.55rem,3vw,2.4rem); text-shadow:0 3px 14px rgba(0,0,0,.26); }
      .kh-gallery-lead { max-width:650px; margin:8px auto 0; color:rgba(255,255,255,.78); }
      .kh-gallery-rule { width:92px; height:2px; margin:17px auto 0; background:linear-gradient(90deg,transparent,#d7b66d,transparent); }
      .kh-photo-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:15px; }
      .kh-photo-card { position:relative; overflow:hidden; min-width:0; margin:0; border:1px solid rgba(215,182,109,.6); border-radius:19px; background:#201b14; box-shadow:0 12px 25px rgba(0,0,0,.24); transition:transform .25s ease,box-shadow .25s ease; }
      .kh-photo-card:hover { transform:translateY(-4px); box-shadow:0 18px 34px rgba(0,0,0,.34); }
      .kh-photo-card.kh-photo-feature { grid-column:span 2; grid-row:span 2; }
      .kh-photo-button { position:relative; display:block; width:100%; min-height:100%; padding:0; border:0; background:#201b14; cursor:zoom-in; }
      .kh-photo-button::after { content:"تكبير الصورة  ⤢"; position:absolute; left:12px; bottom:12px; padding:5px 10px; border:1px solid rgba(241,217,162,.55); border-radius:999px; color:#fff; background:rgba(16,40,32,.8); font-size:.73rem; opacity:0; transition:opacity .2s ease; }
      .kh-photo-button:hover::after,.kh-photo-button:focus-visible::after { opacity:1; }
      .kh-photo-button:focus-visible { outline:3px solid #f1d9a2; outline-offset:-4px; }
      .kh-photo-card img { display:block; width:100%; height:220px; object-fit:cover; background:#e9dfc9; transition:transform .45s ease; }
      .kh-photo-card:hover img { transform:scale(1.035); }
      .kh-photo-feature img { height:100%; min-height:455px; }
      .kh-photo-card figcaption { position:absolute; inset:auto 0 0; padding:30px 14px 12px; color:#fff; font-weight:800; background:linear-gradient(transparent,rgba(8,18,14,.86)); pointer-events:none; }
      .kh-gallery-booking { display:flex; justify-content:center; margin-top:22px; }
      .kh-gallery-booking a { display:inline-flex; align-items:center; justify-content:center; min-height:46px; padding:10px 24px; border:1px solid rgba(255,255,255,.3); border-radius:999px; color:#2a2217; background:linear-gradient(135deg,#f1d9a2,#d7b66d); box-shadow:0 10px 20px rgba(0,0,0,.2); font-weight:800; text-decoration:none; }
      .kh-lightbox { position:fixed; inset:0; z-index:1000; display:grid; place-items:center; padding:56px 24px; background:rgba(7,12,10,.96); backdrop-filter:blur(8px); }
      .kh-lightbox[hidden] { display:none; }
      .kh-lightbox img { display:block; max-width:min(94vw,1500px); max-height:84vh; width:auto; height:auto; object-fit:contain; border:2px solid rgba(215,182,109,.88); border-radius:12px; box-shadow:0 20px 70px rgba(0,0,0,.55); }
      .kh-lightbox-close { position:absolute; top:14px; inset-inline-end:18px; width:48px; height:48px; border:1px solid rgba(241,217,162,.7); border-radius:50%; color:#fff; background:rgba(24,60,50,.92); font-size:1.8rem; cursor:pointer; }
      .kh-lightbox-caption { position:absolute; bottom:15px; max-width:90vw; color:#f1d9a2; text-align:center; text-shadow:0 2px 8px #000; }
      @media(max-width:850px) { .kh-photo-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .kh-photo-feature img { min-height:360px; } }
      @media(max-width:520px) { .kh-gallery { padding:20px 16px; } .kh-photo-grid { grid-template-columns:1fr; } .kh-photo-card.kh-photo-feature { grid-column:auto; grid-row:auto; } .kh-photo-card img,.kh-photo-feature img { height:230px; min-height:0; } .kh-lightbox { padding:56px 12px; } }
      @media(prefers-reduced-motion:reduce) { .kh-photo-card,.kh-photo-card img { transition:none; } }
    </style>`;

  const photos = [
    ["food1.jpg", "مائدة الضيافة والأطباق الشرقية", "مائدة الضيافة", true],
    ["food2.jpg", "تشكيلة مشويات من مطبخ الخيمة", "مشويات الخيمة"],
    ["place1.jpg", "أجواء الجلسات الخارجية في المنتجع", "أجواء المنتجع"],
    ["menu1.jpg", "قائمة الضيافة في منتجع الخيمة", "قائمة الضيافة"],
    ["place2.jpg", "جلسات الخيمة وسط الأشجار", "جلسات وسط الطبيعة"],
    ["place3.jpg", "جلسة عربية داخل الخيمة التراثية", "الخيمة التراثية"],
    ["food3.jpg", "أطباق الأرز والمشويات الطازجة", "أطباق ومشويات"],
    ["banner2.jpg", "هوية منتجع الخيمة وموقعه", "عنوان منتجع الخيمة"]
  ];
  const cards = photos.map(([src, alt, label, featured]) => `
        <figure class="kh-photo-card${featured ? " kh-photo-feature" : ""}">
          <button class="kh-photo-button" type="button" aria-label="تكبير الصورة: ${label}">
            <img loading="lazy" decoding="async" src="./${src}" alt="${alt}">
          </button>
          <figcaption>${label}</figcaption>
        </figure>`).join("");
  const gallery = `
    <section class="kh-gallery" id="gallery" aria-labelledby="galleryTitle">
      <header class="kh-gallery-head">
        <span class="kh-gallery-kicker">منتجع الخيمة · ضيافة أصيلة</span>
        <h2 id="galleryTitle">أجواء المنتجع وقائمة الضيافة</h2>
        <p class="kh-gallery-lead">تفاصيل الجلسات التراثية ومذاقاتنا الشرقية في تجربة ضيافة تجمع الأصالة والراحة.</p>
        <div class="kh-gallery-rule" aria-hidden="true"></div>
      </header>
      <div class="kh-photo-grid">${cards}
      </div>
      <div class="kh-gallery-booking"><a href="#booking">احجز جلستك الآن</a></div>
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
