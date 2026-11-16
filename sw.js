"use strict";

const CACHE_NAME = "montaja-alkhaymah-vip-v7";
const APP_FILES = ["./", "./index.html", "./manifest.json", "./icon.svg"];

function scopedUrl(path) {
  return new URL(path, self.registration.scope).href;
}

function enhancePage(html) {
  if (html.includes("data-alkhaymah-gate")) return html;

  const styles = `
    <style data-alkhaymah-gate>
      body:not(.vip-activated) .topbar,
      body:not(.vip-activated) main > .hero,
      body:not(.vip-activated) main > .section,
      body:not(.vip-activated) main > .reviews-wrap,
      body:not(.vip-activated) footer,
      body:not(.vip-activated) .floating-contact,
      body:not(.vip-activated) #booking,
      body:not(.vip-activated) #downloadButton,
      body:not(.vip-activated) #inviteButton,
      body:not(.vip-activated) .note,
      body:not(.vip-activated) #geofenceStatus { display: none !important; }
      body:not(.vip-activated) main { min-height: calc(100vh - 28px); padding-top: 20px; }
      body:not(.vip-activated) .vip-panel { display: block; margin-top: 0; }
      body:not(.vip-activated) .vip-panel > .panel:not([aria-labelledby="vipHeading"]) { display: none !important; }
      body:not(.vip-activated) #vipHeading + .panel-lead { display: none; }
      .kh-gallery { grid-column: 1 / -1; display: none; margin: 32px 0; padding: clamp(20px,4vw,38px); border: 1px solid rgba(215,182,109,.72); border-radius: 28px; color: #fff; background: radial-gradient(circle at 50% 0,rgba(215,182,109,.18),transparent 42%),linear-gradient(145deg,#183c32,#10251f 65%,#302219); box-shadow: 0 20px 44px rgba(19,41,34,.2); }
      .vip-activated .kh-gallery { display: block; animation: vipReveal .85s cubic-bezier(.2,.8,.2,1) both; }
      .kh-gallery-head { margin: 0 0 24px; text-align: center; }
      .kh-gallery-kicker { color: #f1d9a2; font-size: .82rem; font-weight: 800; }
      .kh-gallery h2 { margin: 5px 0; color: #f1d9a2; font-size: clamp(1.55rem,3vw,2.4rem); }
      .kh-gallery-lead { color: rgba(255,255,255,.8); }
      .kh-photo-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 15px; }
      .kh-photo-card { position: relative; overflow: hidden; min-width: 0; margin: 0; border: 1px solid rgba(215,182,109,.6); border-radius: 19px; background: #201b14; }
      .kh-photo-card.kh-photo-feature { grid-column: span 2; grid-row: span 2; }
      .kh-photo-button { display: block; width: 100%; padding: 0; border: 0; background: #201b14; cursor: zoom-in; }
      .kh-photo-card img { display: block; width: 100%; height: 220px; object-fit: cover; background: #e9dfc9; }
      .kh-photo-feature img { height: 100%; min-height: 455px; }
      .kh-photo-card figcaption { position: absolute; inset: auto 0 0; padding: 30px 14px 12px; color: #fff; font-weight: 800; background: linear-gradient(transparent,rgba(8,18,14,.86)); pointer-events: none; }
      .kh-gallery-booking { display: flex; justify-content: center; margin-top: 22px; }
      .kh-gallery-booking a { display: inline-flex; align-items: center; min-height: 46px; padding: 10px 24px; border: 1px solid rgba(255,255,255,.3); border-radius: 999px; color: #2a2217; background: linear-gradient(135deg,#f1d9a2,#d7b66d); font-weight: 800; text-decoration: none; }
      .vip-activated .topbar, .vip-activated footer { animation: vipReveal .7s ease both; }
      .vip-activated main > .hero, .vip-activated main > .section, .vip-activated main > .reviews-wrap, .vip-activated #booking { animation: vipReveal .85s ease both; }
      .kh-lightbox { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 56px 24px; background: rgba(7,12,10,.96); }
      .kh-lightbox[hidden] { display: none; }
      .kh-lightbox img { max-width: min(94vw,1500px); max-height: 84vh; object-fit: contain; border: 2px solid rgba(215,182,109,.88); border-radius: 12px; }
      .kh-lightbox-close { position: absolute; top: 14px; inset-inline-end: 18px; width: 48px; height: 48px; border: 1px solid #f1d9a2; border-radius: 50%; color: #fff; background: #183c32; font-size: 1.8rem; cursor: pointer; }
      .kh-lightbox-caption { position: absolute; bottom: 15px; color: #f1d9a2; text-align: center; }
      @keyframes vipReveal { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      @media(max-width:850px) { .kh-photo-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } .kh-photo-feature img { min-height: 360px; } }
      @media(max-width:520px) { .kh-photo-grid { grid-template-columns: 1fr; } .kh-photo-card.kh-photo-feature { grid-column: auto; grid-row: auto; } .kh-photo-feature img { min-height: 250px; } }
      @media(prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; } }
    </style>`;

  const fallback = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85";
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
            <img loading="lazy" decoding="async" src="./${src}" alt="${alt}" onerror="this.onerror=null;this.src='${fallback}'">
          </button>
          <figcaption>${label}</figcaption>
        </figure>`).join("");
  const gallery = `
    <section class="kh-gallery" id="gallery" aria-labelledby="galleryTitle">
      <header class="kh-gallery-head">
        <span class="kh-gallery-kicker">منتجع الخيمة · ضيافة أصيلة</span>
        <h2 id="galleryTitle">أجواء المنتجع وقائمة الضيافة</h2>
        <p class="kh-gallery-lead">تفاصيل الجلسات التراثية ومذاقاتنا الشرقية في تجربة ضيافة تجمع الأصالة والراحة.</p>
      </header>
      <div class="kh-photo-grid">${cards}</div>
      <div class="kh-gallery-booking"><a href="#booking">احجز جلستك الآن</a></div>
    </section>
    <div class="kh-lightbox" id="khLightbox" role="dialog" aria-modal="true" aria-label="عرض الصورة" hidden>
      <button class="kh-lightbox-close" type="button" aria-label="إغلاق الصورة">×</button>
      <img alt="" src="" onerror="this.onerror=null;this.src='${fallback}'">
      <div class="kh-lightbox-caption" aria-live="polite"></div>
    </div>`;
  const script = `
    <script data-alkhaymah-gate>
      (() => {
        const body = document.body;
        const button = document.getElementById("activateButton");
        const name = document.getElementById("vipName");
        const status = document.getElementById("vipStatus");
        const showContent = () => {
          body.classList.add("vip-activated");
          if (status) {
            status.textContent = "تم تفعيل البطاقة بنجاح";
            status.classList.remove("error");
            status.classList.add("success");
          }
        };
        try {
          const pass = JSON.parse(localStorage.getItem("alkhaymah_vip_pass") || "null");
          if (pass && typeof pass.memberId === "string" && typeof pass.gift === "string") showContent();
        } catch (_) {}
        if (button) {
          button.addEventListener("click", event => {
            if (!name || !name.value.trim()) {
              event.preventDefault();
              event.stopImmediatePropagation();
              if (status) {
                status.textContent = "يرجى كتابة الاسم أولاً لتفعيل البطاقة.";
                status.classList.add("error");
                status.classList.remove("success");
              }
              if (name) name.focus();
            }
          }, true);
          button.addEventListener("click", () => {
            window.setTimeout(() => {
              if (button.disabled && document.getElementById("memberId").textContent.startsWith("KH-")) {
                showContent();
                document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }, 0);
          });
        }
        const modal = document.getElementById("khLightbox");
        if (!modal) return;
        const image = modal.querySelector("img");
        const caption = modal.querySelector(".kh-lightbox-caption");
        const closeButton = modal.querySelector(".kh-lightbox-close");
        let lastTrigger = null;
        const close = () => { modal.hidden = true; document.body.style.overflow = ""; lastTrigger?.focus(); };
        document.querySelectorAll(".kh-photo-button").forEach(photoButton => photoButton.addEventListener("click", () => {
          const thumb = photoButton.querySelector("img");
          lastTrigger = photoButton;
          image.src = thumb.currentSrc || thumb.src;
          image.alt = thumb.alt;
          caption.textContent = thumb.closest("figure").querySelector("figcaption").textContent;
          modal.hidden = false;
          document.body.style.overflow = "hidden";
          closeButton.focus();
        }));
        closeButton.addEventListener("click", close);
        modal.addEventListener("click", event => { if (event.target === modal) close(); });
        document.addEventListener("keydown", event => { if (!modal.hidden && event.key === "Escape") close(); });
      })();
    </script>`;

  let result = html.replace("</head>", styles + "\n</head>");
  const bookingMarker = '<section class="panel" id="booking"';
  const bookingAt = result.indexOf(bookingMarker);
  if (bookingAt !== -1) result = result.slice(0, bookingAt) + gallery + "\n      " + result.slice(bookingAt);
  result = result.replace("</body>", script + "\n</body>");
  return result;
}

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME)
    .then(cache => cache.addAll(APP_FILES.map(scopedUrl)))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin || !requestUrl.href.startsWith(self.registration.scope)) return;

  const indexUrl = scopedUrl("./index.html");
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(async response => {
      if (!response || !response.ok || !(response.headers.get("content-type") || "").includes("text/html")) return response;
      const page = enhancePage(await response.clone().text());
      const headers = new Headers(response.headers);
      headers.delete("content-length");
      const enhanced = new Response(page, { status: response.status, statusText: response.statusText, headers });
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, enhanced.clone());
      await cache.put(indexUrl, enhanced.clone());
      return enhanced;
    }).catch(async () => (await caches.match(request)) || caches.match(indexUrl)));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  })));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const data = event.notification.data || {};
  let targetUrl = data.url || self.registration.scope;
  if (event.action === "invite" && data.inviteUrl) targetUrl = data.inviteUrl;
  else if (event.action === "book") {
    const bookingUrl = new URL(data.url || self.registration.scope);
    bookingUrl.hash = "booking";
    targetUrl = bookingUrl.href;
  }
  event.waitUntil((async () => {
    const openClients = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const client of openClients) {
      if (client.url.startsWith(self.registration.scope)) {
        if (event.action === "invite") break;
        if ("navigate" in client) await client.navigate(targetUrl);
        return client.focus();
      }
    }
    await clients.openWindow(targetUrl);
  })());
});
