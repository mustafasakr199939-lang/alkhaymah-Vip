"use strict";

const CACHE_NAME = "montaja-alkhaymah-vip-v3";
const APP_FILES = ["./", "./index.html", "./manifest.json", "./icon.svg"];

function scopedUrl(path) {
  return new URL(path, self.registration.scope).href;
}

function enhancePage(html) {
  if (html.includes("data-premium-extras")) return html;

  const styles = `
    <style data-premium-extras>
      html { scroll-padding-top: 155px; }
      .vip-spotlight { position:relative; isolation:isolate; display:grid; grid-template-columns:minmax(0,1.3fr) minmax(210px,.7fr); align-items:center; gap:20px; margin:22px 0 28px; padding:clamp(22px,4vw,38px); overflow:hidden; border:1px solid rgba(242,216,160,.8); border-radius:28px; color:#fff; background:radial-gradient(circle at 5% 10%,rgba(215,182,109,.26),transparent 35%),linear-gradient(130deg,#0e2d24,#1c4d3e 62%,#332a18); box-shadow:0 24px 54px rgba(16,44,35,.23); }
      .vip-spotlight::after { content:""; position:absolute; z-index:-1; inset:-60% -20% auto auto; width:270px; height:270px; border:1px solid rgba(242,216,160,.22); border-radius:50%; box-shadow:0 0 0 28px rgba(242,216,160,.035),0 0 0 58px rgba(242,216,160,.025); }
      .vip-spotlight-copy { position:relative; z-index:1; }
      .vip-kicker { display:inline-flex; align-items:center; gap:8px; margin-bottom:8px; padding:5px 11px; border:1px solid rgba(242,216,160,.45); border-radius:999px; color:#f2d89e; font-size:.8rem; font-weight:800; }
      .vip-spotlight h3 { margin:0 0 8px; color:#f5dc9e; font-size:clamp(1.45rem,3vw,2.1rem); }
      .vip-spotlight p { max-width:620px; margin:0; color:rgba(255,255,255,.82); }
      .vip-spotlight .royal-cta { margin-top:17px; }
      .vip-emblem { justify-self:center; display:grid; place-items:center; width:clamp(150px,22vw,220px); aspect-ratio:1; border:1px solid rgba(242,216,160,.68); border-radius:30px; background:linear-gradient(145deg,rgba(242,216,160,.2),rgba(4,23,17,.42)); box-shadow:inset 0 0 30px rgba(242,216,160,.08),0 16px 36px rgba(0,0,0,.2); transform:rotate(-4deg); }
      .vip-emblem-inner { display:grid; place-items:center; width:78%; height:78%; border:1px solid rgba(242,216,160,.45); border-radius:22px; color:#f2d89e; text-align:center; }
      .vip-emblem-inner strong { display:block; font-size:2.5rem; line-height:1.1; letter-spacing:2px; }
      .vip-emblem-inner span { font-size:.78rem; font-weight:700; }
      .offers-section,.reviews-section { margin:30px 0 24px; padding:clamp(20px,3vw,28px); border:1px solid rgba(215,182,109,.42); border-radius:26px; background:linear-gradient(140deg,rgba(255,255,255,.95),rgba(246,239,222,.95)); box-shadow:var(--shadow-soft); }
      .premium-heading { margin:0 0 6px; color:var(--green); font-size:clamp(1.35rem,3vw,2rem); }
      .premium-lead { margin:0 0 18px; color:var(--muted); }
      .offer-grid,.review-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; }
      .offer-card { position:relative; overflow:hidden; min-height:175px; padding:19px; border:1px solid rgba(215,182,109,.45); border-radius:19px; background:linear-gradient(145deg,#173e32,#102c25); color:#fff; box-shadow:0 12px 25px rgba(24,60,50,.12); transition:transform .25s ease,box-shadow .25s ease; }
      .offer-card:hover { transform:translateY(-5px); box-shadow:0 18px 30px rgba(24,60,50,.2); }
      .offer-card::after { content:""; position:absolute; inset:auto -20px -35px auto; width:110px; height:110px; border:1px solid rgba(242,216,160,.3); border-radius:50%; box-shadow:0 0 0 15px rgba(242,216,160,.045); }
      .offer-badge { display:inline-block; margin-bottom:9px; padding:4px 10px; border-radius:999px; color:#332a18; background:#e9cf8f; font-size:.76rem; font-weight:800; }
      .offer-card h4 { position:relative; z-index:1; margin:0 0 6px; color:#f2d89e; font-size:1.05rem; }
      .offer-card p { position:relative; z-index:1; margin:0; color:rgba(255,255,255,.8); font-size:.88rem; }
      .review-card { padding:18px; border:1px solid rgba(215,182,109,.35); border-radius:18px; background:#fff; box-shadow:0 10px 24px rgba(24,60,50,.07); }
      .review-stars { color:#b8872d; letter-spacing:3px; font-size:1.05rem; }
      .review-card blockquote { margin:10px 0 14px; color:#42534a; font-size:.92rem; }
      .review-card strong { color:var(--green); font-size:.88rem; }
      .booking-shortcuts { display:flex; flex-wrap:wrap; gap:9px; margin:0 0 15px; padding:13px; border:1px solid rgba(215,182,109,.38); border-radius:15px; background:linear-gradient(120deg,#fbf7ed,#fff); }
      .booking-shortcuts span { align-self:center; color:var(--green); font-size:.87rem; font-weight:800; }
      .guest-choice { min-height:40px; padding:7px 13px; border:1px solid rgba(24,60,50,.18); border-radius:999px; color:var(--green); background:#fff; cursor:pointer; font-weight:800; transition:all .2s ease; }
      .guest-choice:hover,.guest-choice:focus-visible { color:#fff; border-color:var(--green); background:var(--green); transform:translateY(-2px); outline:none; }
      #bookingForm .btn-primary[type="submit"] { min-height:50px; padding-inline:21px; border:1px solid rgba(215,182,109,.45); box-shadow:0 10px 22px rgba(24,60,50,.2); transition:transform .2s ease,box-shadow .2s ease; }
      #bookingForm .btn-primary[type="submit"]:hover { transform:translateY(-3px); box-shadow:0 16px 28px rgba(24,60,50,.25); }
      .royal-nav { backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); }
      #vipHeading,#menuTitle,#galleryTitle,#bookingHeading,#contact,#offersTitle,#reviewsTitle { scroll-margin-top:155px; }
      @media(max-width:800px) { .offer-grid,.review-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
      @media(max-width:600px) { .vip-spotlight { grid-template-columns:1fr; text-align:center; } .vip-emblem { grid-row:1; width:142px; } .vip-spotlight .royal-cta { margin-inline:auto; } .offer-grid,.review-grid { grid-template-columns:1fr; } .booking-shortcuts { align-items:center; } }
      @media(prefers-reduced-motion:reduce) { .offer-card,.guest-choice,#bookingForm .btn-primary[type="submit"] { transition:none; } }
    </style>`;

  const vipSpotlight = `
    <section class="vip-spotlight reveal" aria-labelledby="vipSpotlightTitle">
      <div class="vip-spotlight-copy">
        <span class="vip-kicker">✦ عضوية الضيافة المميزة</span>
        <h3 id="vipSpotlightTitle">تجربة استثنائية تبدأ ببطاقة VIP</h3>
        <p>فعّل عضويتك لتحصل على بطاقة رقمية وهدية ضيافة مختارة، واحتفظ بتفاصيلها على جهازك لتكون جاهزاً لزيارتك.</p>
        <a class="royal-cta" href="#vipHeading"><span aria-hidden="true">♕</span><span>اكتشف بطاقة العضوية</span></a>
      </div>
      <div class="vip-emblem" aria-hidden="true"><div class="vip-emblem-inner"><div><strong>VIP</strong><span>منتجع الخيمة</span></div></div></div>
    </section>`;

  const offers = `
    <section class="offers-section reveal" aria-labelledby="offersTitle">
      <h3 class="premium-heading" id="offersTitle">عروض الضيافة</h3>
      <p class="premium-lead">لحظات أجمل ولمسات كريمة تضيف إلى زيارتك طابعاً خاصاً.</p>
      <div class="offer-grid">
        <article class="offer-card"><span class="offer-badge">هدية العضوية</span><h4>هدية ترحيب لحاملي بطاقة VIP</h4><p>فعّل بطاقتك لتظهر لك هدية ضيافة مختارة، واستفسر من فريقنا عن طريقة الاستفادة عند وصولك.</p></article>
        <article class="offer-card"><span class="offer-badge">للمة الأحباب</span><h4>ترتيبات العزومات</h4><p>أرسل عدد الضيوف وتفاصيل الموعد مسبقاً لنساعدك في تنسيق جلسة تليق بمناسبتك.</p></article>
        <article class="offer-card"><span class="offer-badge">ضيافة أصيلة</span><h4>قهوة عربية ومذاق شرقي</h4><p>استمتع بأجواء الضيافة الدافئة مع أصناف مختارة من المنيو لزيارتك القادمة.</p></article>
      </div>
    </section>`;

  const reviews = `
    <section class="reviews-section reveal" aria-labelledby="reviewsTitle">
      <h3 class="premium-heading" id="reviewsTitle">انطباعات ضيوفنا</h3>
      <p class="premium-lead">نحرص على أن تكون كل زيارة ذكرى جميلة تستحق العودة.</p>
      <div class="review-grid">
        <article class="review-card"><div class="review-stars" aria-label="خمس نجوم">★★★★★</div><blockquote>«الأجواء هادئة والجلسة مريحة، وكانت الضيافة دافئة من لحظة وصولنا.»</blockquote><strong>ضيف من العائلة</strong></article>
        <article class="review-card"><div class="review-stars" aria-label="خمس نجوم">★★★★★</div><blockquote>«مكان جميل للّمة، وتنوع الأطباق جعل اختيارنا سهلاً وممتعاً.»</blockquote><strong>زائر للمنتجع</strong></article>
        <article class="review-card"><div class="review-stars" aria-label="خمس نجوم">★★★★★</div><blockquote>«بطاقة العضوية فكرة لطيفة، وتجربة الحجز كانت واضحة وسريعة.»</blockquote><strong>ضيف مميز</strong></article>
      </div>
    </section>`;

  let result = html.replace("</style>", styles + "\n</style>");

  // Keep the existing site sections intact; add the enhanced presentation around them.
  const introEnd = result.indexOf("</section>", result.indexOf('<section class="intro'));
  if (introEnd !== -1) {
    const insertAt = introEnd + "</section>".length;
    result = result.slice(0, insertAt) + "\n" + vipSpotlight + "\n" + offers + result.slice(insertAt);
  }

  const galleryStart = result.indexOf('<section class="luxury-section');
  if (galleryStart !== -1) {
    result = result.slice(0, galleryStart) + reviews + "\n" + result.slice(galleryStart);
  }

  const formOpen = result.indexOf('<form id="bookingForm">');
  if (formOpen !== -1) {
    const insertAt = formOpen + '<form id="bookingForm">'.length;
    const shortcuts = `
          <div class="booking-shortcuts" aria-label="اختيار سريع لعدد الضيوف">
            <span>اختر عدد الضيوف:</span>
            <button class="guest-choice" type="button" data-guests="2">ضيفان</button>
            <button class="guest-choice" type="button" data-guests="4">أربعة ضيوف</button>
            <button class="guest-choice" type="button" data-guests="8">ثمانية ضيوف</button>
          </div>`;
    result = result.slice(0, insertAt) + shortcuts + result.slice(insertAt);
  }

  result = result.replace("  <footer", "  <footer");
  result = result.replace("</body>", `
    <script data-premium-extras>
      document.querySelectorAll('.royal-nav a, .royal-cta').forEach(link => {
        link.addEventListener('click', event => {
          const selector = link.getAttribute('href');
          if (!selector || selector.charAt(0) !== '#') return;
          const destination = document.querySelector(selector);
          if (!destination) return;
          event.preventDefault();
          destination.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
      document.querySelectorAll('.guest-choice').forEach(button => {
        button.addEventListener('click', () => {
          const guestsInput = document.getElementById('guests');
          if (!guestsInput) return;
          guestsInput.value = button.dataset.guests;
          guestsInput.dispatchEvent(new Event('input', { bubbles: true }));
          guestsInput.dispatchEvent(new Event('change', { bubbles: true }));
          guestsInput.focus({ preventScroll: true });
        });
      });
      if ('IntersectionObserver' in window) {
        const premiumObserver = new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            premiumObserver.unobserve(entry.target);
          }
        }), { threshold: 0.1 });
        document.querySelectorAll('.vip-spotlight,.offers-section,.reviews-section').forEach(section => premiumObserver.observe(section));
      } else {
        document.querySelectorAll('.vip-spotlight,.offers-section,.reviews-section').forEach(section => section.classList.add('is-visible'));
      }
    </script>
  </body>`);

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
  // لا نعترض ملفات المواقع الخارجية، مثل واتساب أو مكتبة رمز الاستجابة السريعة.
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
