"use strict";

const CACHE_NAME = "montaja-alkhaymah-vip-v2";
const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg"
];

function scopedUrl(path) {
  return new URL(path, self.registration.scope).href;
}

function enhancePage(html) {
  if (html.includes("data-royal-enhancements")) return html;

  const styles = `
    <style data-royal-enhancements>
      html { scroll-padding-top: 145px; }
      body { padding-bottom: 76px; }
      .topbar { background: rgba(17, 48, 39, .92) !important; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
      .royal-nav { width: min(1050px, calc(100% - 32px)); margin: 12px auto 0; display: flex; align-items: center; justify-content: center; gap: 7px; flex-wrap: wrap; }
      .royal-nav a { color: #fff; text-decoration: none; font-size: .82rem; font-weight: 700; padding: 7px 11px; border: 1px solid rgba(215,182,109,.26); border-radius: 999px; transition: background .2s ease, color .2s ease; }
      .royal-nav a:hover, .royal-nav a:focus-visible { background: var(--gold); color: #20382f; outline: none; }
      .royal-cta { display: inline-flex; align-items: center; justify-content: center; gap: 9px; margin-top: 18px; min-height: 50px; padding: 12px 22px; border: 1px solid rgba(255,255,255,.55); border-radius: 999px; color: #282219; background: linear-gradient(120deg, #f8e6b5, #d7b66d 48%, #f8e6b5); background-size: 220% 100%; box-shadow: 0 12px 28px rgba(145,103,34,.24); font-weight: 800; text-decoration: none; animation: royal-glow 4s ease-in-out infinite; transition: transform .2s ease, box-shadow .2s ease; }
      .royal-cta:hover { transform: translateY(-3px); box-shadow: 0 16px 34px rgba(145,103,34,.32); }
      @keyframes royal-glow { 0%,100% { background-position: 0 0; } 50% { background-position: 100% 0; } }
      .why-us { margin: 30px 0 24px; padding: 26px 20px; border-radius: 26px; background: radial-gradient(circle at 15% 0%, rgba(215,182,109,.17), transparent 38%), linear-gradient(135deg,#102d25,#1e493b 62%,#302817); border: 1px solid rgba(215,182,109,.65); box-shadow: 0 20px 46px rgba(15,35,28,.2); color: #fff; }
      .why-us h3, .faq-section h3 { margin: 0 0 8px; font-size: clamp(1.35rem, 3vw, 2rem); }
      .why-us h3 { color: #f0d58f; }
      .why-lead { margin: 0 0 18px; color: rgba(255,255,255,.78); }
      .why-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 13px; }
      .why-card { padding: 17px 15px; border: 1px solid rgba(215,182,109,.38); border-radius: 17px; background: linear-gradient(145deg,rgba(215,182,109,.15),rgba(8,24,19,.3)); transition: transform .25s ease, background .25s ease; }
      .why-card:hover { transform: translateY(-5px); background: linear-gradient(145deg,rgba(215,182,109,.24),rgba(8,24,19,.38)); }
      .why-icon { display: block; font-size: 1.55rem; margin-bottom: 8px; }
      .why-card h4 { margin: 0 0 5px; color: #f2d89e; font-size: 1rem; }
      .why-card p { margin: 0; color: rgba(255,255,255,.78); font-size: .86rem; }
      .faq-section { margin: 30px 0 24px; padding: 23px 20px; border: 1px solid rgba(215,182,109,.42); border-radius: 24px; background: linear-gradient(140deg,rgba(255,255,255,.94),rgba(246,239,222,.95)); box-shadow: var(--shadow-soft); }
      .faq-section h3 { color: var(--green); }
      .faq-lead { margin: 0 0 16px; color: var(--muted); }
      .faq-list { display: grid; gap: 10px; }
      .faq-list details { border: 1px solid rgba(215,182,109,.38); border-radius: 15px; background: rgba(255,255,255,.78); overflow: hidden; transition: box-shadow .2s ease, border-color .2s ease; }
      .faq-list details[open] { border-color: var(--gold); box-shadow: 0 10px 24px rgba(24,60,50,.08); }
      .faq-list summary { position: relative; cursor: pointer; list-style: none; padding: 14px 44px 14px 16px; color: var(--green); font-weight: 800; }
      .faq-list summary::-webkit-details-marker { display: none; }
      .faq-list summary::before { content: "+"; position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 23px; height: 23px; display: grid; place-items: center; color: #302817; background: var(--gold); border-radius: 50%; transition: transform .2s ease; }
      .faq-list details[open] summary::before { content: "−"; transform: translateY(-50%) rotate(180deg); }
      .faq-answer { margin: 0; padding: 0 16px 15px; color: var(--muted); font-size: .92rem; animation: faq-in .25s ease; }
      @keyframes faq-in { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      .floating-contact { position: fixed; z-index: 50; inset-inline-start: 18px; bottom: max(18px, env(safe-area-inset-bottom)); display: inline-flex; align-items: center; gap: 9px; min-height: 54px; padding: 10px 17px; border: 2px solid rgba(255,255,255,.82); border-radius: 999px; color: #fff; background: linear-gradient(135deg,#1eaa68,#08764a); box-shadow: 0 12px 28px rgba(10,83,53,.34); text-decoration: none; font-weight: 800; transition: transform .2s ease, box-shadow .2s ease; }
      .floating-contact:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 17px 34px rgba(10,83,53,.4); }
      .floating-contact span:first-child { font-size: 1.35rem; }
      #vipHeading, #menuTitle, #galleryTitle, #bookingHeading, #contact { scroll-margin-top: 150px; }
      @media (max-width: 860px) { .why-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
      @media (max-width: 760px) { .royal-nav { justify-content: flex-start; flex-wrap: nowrap; overflow-x: auto; padding: 2px 0 5px; scrollbar-width: none; } .royal-nav::-webkit-scrollbar { display: none; } .royal-nav a { flex: 0 0 auto; } }
      @media (max-width: 540px) { html { scroll-padding-top: 175px; } .why-us, .faq-section { padding: 20px 15px; } .why-grid { grid-template-columns: 1fr; } .floating-contact { width: 54px; height: 54px; justify-content: center; padding: 0; inset-inline-start: 14px; } .floating-contact span:last-child { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; } }
      @media (prefers-reduced-motion: reduce) { .royal-cta, .faq-answer { animation: none !important; } *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; } }
    </style>`;

  const nav = `
    <nav class="royal-nav" aria-label="التنقل بين أقسام الموقع">
      <a href="#vipHeading">بطاقة العضوية</a>
      <a href="#menuTitle">قائمة الضيافة</a>
      <a href="#galleryTitle">المعرض</a>
      <a href="#booking">الحجز</a>
      <a href="#contact">تواصل معنا</a>
    </nav>`;

  const cta = `<a class="royal-cta" href="#booking"><span aria-hidden="true">✦</span><span>احجز جلستك الآن</span></a>`;

  const why = `
    <section class="why-us reveal" aria-labelledby="whyTitle">
      <h3 id="whyTitle">لماذا منتجع الخيمة؟</h3>
      <p class="why-lead">حفاوة الضيافة الأصيلة في أجواء تجمع الفخامة والراحة والخصوصية.</p>
      <div class="why-grid">
        <article class="why-card"><span class="why-icon" aria-hidden="true">✧</span><h4>جلسات بدوية ملكية</h4><p>تفاصيل دافئة وديكورات مستوحاة من أصالة الصحراء.</p></article>
        <article class="why-card"><span class="why-icon" aria-hidden="true">♨</span><h4>طعم طازج على الفحم</h4><p>مشويات وطواجن تُحضّر بعناية لتكتمل متعة الضيافة.</p></article>
        <article class="why-card"><span class="why-icon" aria-hidden="true">❖</span><h4>خصوصية للعائلات</h4><p>مساحات مريحة وأجواء هادئة تناسب اللقاءات العائلية.</p></article>
        <article class="why-card"><span class="why-icon" aria-hidden="true">♕</span><h4>ضيافة عضوية مميزة</h4><p>ترحيب كريم وامتيازات خاصة لحاملي بطاقة العضوية.</p></article>
      </div>
    </section>`;

  const faq = `
    <section class="faq-section reveal" aria-labelledby="faqTitle">
      <h3 id="faqTitle">الأسئلة المتكررة</h3>
      <p class="faq-lead">إجابات مختصرة تساعدك على التخطيط لزيارتك.</p>
      <div class="faq-list">
        <details><summary>ما مواعيد العمل؟</summary><p class="faq-answer">تختلف مواعيد العمل بحسب اليوم والموسم؛ يُرجى التواصل معنا قبل الزيارة للتأكد من الموعد المتاح.</p></details>
        <details><summary>كيف أستخدم هدية بطاقة العضوية؟</summary><p class="faq-answer">أبرز بطاقة العضوية المفعّلة عند الوصول، وأخبر فريق الضيافة بالهدية الظاهرة على بطاقتك للاستفادة منها وفق التوفر.</p></details>
        <details><summary>هل يمكن حجز عزومة كبيرة؟</summary><p class="faq-answer">نعم، أرسل تفاصيل الموعد وعدد الضيوف عبر نموذج الحجز أو واتساب، وسنتواصل معك لتأكيد الترتيبات.</p></details>
        <details><summary>هل تتوفر جلسات مخصصة للعائلات؟</summary><p class="faq-answer">تتوفر جلسات مناسبة للعائلات بحسب الإشغال؛ يُفضّل ذكر رغبتك في جلسة عائلية ضمن ملاحظات الحجز.</p></details>
      </div>
    </section>`;

  const floating = `<a class="floating-contact" href="https://wa.me/201020014584" target="_blank" rel="noopener noreferrer" aria-label="تواصل معنا عبر واتساب"><span aria-hidden="true">☏</span><span>تواصل عبر واتساب</span></a>`;

  let result = html.replace("</style>", styles + "\n  </style>");
  result = result.replace("</header>", nav + "\n  </header>");
  result = result.replace("<p>فعّل بطاقة VIP، احصل على هديتك، ثم أرسل تفاصيل حجزك مباشرةً عبر واتساب.</p>", "<p>فعّل بطاقة VIP، احصل على هديتك، ثم أرسل تفاصيل حجزك مباشرةً عبر واتساب.</p>\n      " + cta);
  result = result.replace('<section class="luxury-section reveal" aria-labelledby="galleryTitle">', '<section id="gallery" class="luxury-section reveal" aria-labelledby="galleryTitle">');
  result = result.replace('<section class="menu-shell reveal" aria-labelledby="menuTitle">', '<section id="menu" class="menu-shell reveal" aria-labelledby="menuTitle">');
  result = result.replace('<section class="panel" aria-labelledby="vipHeading">', '<section class="panel" id="vip" aria-labelledby="vipHeading">');
  result = result.replace('<section class="panel" id="booking" aria-labelledby="bookingHeading">', '<section class="panel" id="booking" aria-labelledby="bookingHeading">');
  result = result.replace('    <div class="grid reveal">', why + '\n\n    <div class="grid reveal">');
  result = result.replace("  <footer>", faq + '\n\n  <footer id="contact">');
  result = result.replace("  <script src=", floating + "\n\n  <script src=");
  result = result.replace("    initRevealAnimations();", "    initRevealAnimations();\n    const enhancedSections = document.querySelectorAll('.why-us, .faq-section');\n    if ('IntersectionObserver' in window) {\n      const enhancementObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); enhancementObserver.unobserve(entry.target); } }), { threshold: 0.12 });\n      enhancedSections.forEach(section => enhancementObserver.observe(section));\n    } else {\n      enhancedSections.forEach(section => section.classList.add('is-visible'));\n    }");
  result = result.replace("</body>", "  <script data-royal-enhancements>\n    document.querySelectorAll('.royal-nav a, .royal-cta').forEach(link => {\n      link.addEventListener('click', event => {\n        const target = document.querySelector(link.getAttribute('href'));\n        if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }\n      });\n    });\n  </script>\n</body>");

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

  // لا نعترض ملفات المواقع الخارجية، مثل واتساب أو مكتبة رمز الاستجابة السريعة.
  if (requestUrl.origin !== scopeUrl.origin) return;
  if (!requestUrl.href.startsWith(self.registration.scope)) return;

  const indexUrl = scopedUrl("./index.html");

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async response => {
          if (!response || !response.ok) return response;
          const contentType = response.headers.get("content-type") || "";
          if (!contentType.includes("text/html")) return response;

          const html = enhancePage(await response.clone().text());
          const headers = new Headers(response.headers);
          headers.delete("content-length");
          const enhancedResponse = new Response(html, {
            status: response.status,
            statusText: response.statusText,
            headers
          });

          const responseCopy = enhancedResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseCopy);
            cache.put(indexUrl, enhancedResponse.clone());
          });
          return enhancedResponse;
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
