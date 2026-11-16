(() => {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
    .vip-enhance-tools{position:fixed;top:82px;left:12px;z-index:80;display:flex;gap:7px;align-items:center}
    .vip-enhance-tools button{border:1px solid #d7b66d99;border-radius:999px;background:#14231feF;color:#f1d9a2;padding:9px 12px;font:700 13px Tahoma,Arial,sans-serif;box-shadow:0 6px 20px #13292224;cursor:pointer;backdrop-filter:blur(10px)}
    .vip-enhance-tools button:focus-visible,.vip-flip-trigger:focus-visible{outline:3px solid #f1d9a2;outline-offset:3px}
    .vip-card-scene{perspective:1100px;position:relative;margin:10px 0 16px;touch-action:pan-y}
    .vip-card-flipper{position:relative;min-height:230px;transform-style:preserve-3d;transition:transform .72s cubic-bezier(.2,.72,.25,1);will-change:transform}
    .vip-card-scene.is-flipped .vip-card-flipper{transform:rotateY(180deg)}
    .vip-card-face{position:absolute;inset:0;min-height:230px;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:22px;overflow:hidden}
    .vip-card-face.front{z-index:1}
    .vip-card-face.back{transform:rotateY(180deg);display:grid;grid-template-columns:130px 1fr;gap:14px;align-items:center;padding:18px;background:radial-gradient(circle at 15% 10%,#d7b66d30,transparent 35%),linear-gradient(135deg,#10251f,#1d4a3d);border:1px solid #d7b66db3;color:#fff;box-shadow:0 18px 38px #13292230}
    .vip-card-face.front>.vip-card{height:100%;min-height:230px;cursor:pointer;position:relative;overflow:hidden;transform-style:preserve-3d;transition:box-shadow .2s ease}
    .vip-card-face.front>.vip-card::after{content:"";position:absolute;inset:-40% -70%;pointer-events:none;background:linear-gradient(110deg,transparent 43%,#fff8 49%,#f1d9a255 52%,transparent 59%);transform:translateX(-35%) rotate(9deg);transition:transform .4s ease}
    .vip-card-scene.is-sheened .vip-card-face.front>.vip-card::after{transform:translateX(45%) rotate(9deg)}
    .vip-card-face.front>.vip-card>div:first-child{position:relative;z-index:1}
    .vip-card-face.back .qr-box{margin:0;width:120px;height:120px;max-width:120px;max-height:120px}
    .vip-card-face.back .qr-box canvas,.vip-card-face.back .qr-box img{max-width:106px;max-height:106px}
    .vip-back-details{display:grid;gap:8px;align-content:center;min-width:0}
    .vip-back-details strong{color:#f1d9a2;font-size:1.04rem;overflow-wrap:anywhere}
    .vip-back-details span{font-size:.84rem;color:#ffffffcf}
    .vip-flip-trigger{position:absolute;z-index:5;left:10px;bottom:10px;border:1px solid #f1d9a288;border-radius:999px;padding:7px 10px;background:#0c1c18d9;color:#f1d9a2;font:700 12px Tahoma,Arial,sans-serif;cursor:pointer}
    .vip-smart-greeting{display:inline-flex;margin:5px 0 12px;padding:7px 13px;border:1px solid #d7b66d80;border-radius:999px;background:#fff9e8;color:#183c32;font-weight:800}
    .vip-ticker{overflow:hidden;margin:12px 0 18px;border:1px solid #d7b66d99;border-radius:14px;background:#14231f;color:#f7f1e4;white-space:nowrap}
    .vip-ticker-track{display:flex;width:max-content;animation:vipTickerMove 26s linear infinite}
    .vip-ticker span{padding:10px 20px;font-size:.82rem}
    .vip-ticker span::before{content:"✦";color:#f1d9a2;margin-inline-end:9px}
    @keyframes vipTickerMove{to{transform:translateX(50%)}}
    .vip-scratch{position:relative;isolation:isolate;margin:16px 0 8px;min-height:120px;border:1px solid #d7b66d;border-radius:16px;overflow:hidden;background:linear-gradient(135deg,#fff1bf,#d7b66d 50%,#b88d3f);color:#183c32}
    .vip-scratch-prize{min-height:120px;display:grid;place-content:center;text-align:center;padding:18px;font-weight:800;gap:4px}
    .vip-scratch-prize small{font-weight:500}
    .vip-scratch canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:crosshair}
    .vip-scratch.is-revealed canvas{opacity:0;pointer-events:none;transition:opacity .4s ease}
    .vip-confetti{position:fixed;inset:0;width:100%;height:100%;z-index:999;pointer-events:none}
    @media(max-width:540px){.vip-enhance-tools{top:72px;left:8px}.vip-card-face.back{grid-template-columns:104px 1fr;padding:12px;gap:10px}.vip-card-face.back .qr-box{width:100px;height:100px}.vip-card-face.back .qr-box canvas,.vip-card-face.back .qr-box img{max-width:88px;max-height:88px}.vip-card-flipper,.vip-card-face,.vip-card-face.front>.vip-card{min-height:215px}}
    @media(prefers-reduced-motion:reduce){.vip-card-flipper,.vip-ticker-track,.vip-card-face.front>.vip-card::after{transition:none!important;animation:none!important}}
  `;
  document.head.appendChild(style);

  const get = id => document.getElementById(id);
  const originalCard = get("vipCard");
  if (!originalCard) return;

  let soundOn = true;
  let audioContext;
  let isScratching = false;
  let scratchRevealed = false;
  let lastCheck = 0;
  let tiltBound = false;

  function haptic(ms = 16) {
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  function tone(kind = "tap") {
    if (!soundOn) return;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    try {
      audioContext ||= new AudioCtor();
      if (audioContext.state === "suspended") audioContext.resume();
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = kind === "reveal" ? "sine" : "triangle";
      osc.frequency.setValueAtTime(kind === "reveal" ? 660 : 880, now);
      if (kind === "reveal") osc.frequency.exponentialRampToValueAtTime(990, now + .16);
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.exponentialRampToValueAtTime(.035, now + .015);
      gain.gain.exponentialRampToValueAtTime(.0001, now + .2);
      osc.connect(gain); gain.connect(audioContext.destination);
      osc.start(now); osc.stop(now + .21);
    } catch (_) { /* Audio is an optional enhancement. */ }
  }

  const scene = document.createElement("div");
  scene.className = "vip-card-scene";
  scene.setAttribute("role", "group");
  scene.setAttribute("aria-label", "بطاقة VIP التفاعلية؛ اضغط لعرض الخلف");
  const flipper = document.createElement("div");
  flipper.className = "vip-card-flipper";
  const front = document.createElement("div");
  front.className = "vip-card-face front";
  const back = document.createElement("div");
  back.className = "vip-card-face back";
  const backDetails = document.createElement("div");
  backDetails.className = "vip-back-details";
  backDetails.innerHTML = '<strong class="vip-back-member">عضوية الخيمة</strong><span>امسح رمز QR للتحقق من عضويتك</span><span>ضيافة • حجز مميز • امتيازات خاصة</span>';

  const qr = get("qrcode");
  if (qr) back.append(qr);
  back.append(backDetails);
  const parent = originalCard.parentNode;
  parent.insertBefore(scene, originalCard);
  front.append(originalCard);
  flipper.append(front, back);
  scene.append(flipper);

  const flipButton = document.createElement("button");
  flipButton.type = "button";
  flipButton.className = "vip-flip-trigger";
  flipButton.textContent = "اقلب البطاقة ↻";
  flipButton.setAttribute("aria-pressed", "false");
  scene.append(flipButton);
  originalCard.setAttribute("role", "button");
  originalCard.setAttribute("tabindex", "0");
  originalCard.setAttribute("aria-label", "اقلب بطاقة العضوية لعرض رمز QR");

  function flipCard() {
    const flipped = scene.classList.toggle("is-flipped");
    flipButton.setAttribute("aria-pressed", String(flipped));
    flipButton.textContent = flipped ? "الوجه الأمامي ↻" : "اقلب البطاقة ↻";
    haptic(20); tone("tap");
  }
  flipButton.addEventListener("click", flipCard);
  originalCard.addEventListener("click", event => {
    if (event.target.closest("button,a,input")) return;
    flipCard();
  });
  originalCard.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); flipCard(); }
  });

  const tools = document.createElement("div");
  tools.className = "vip-enhance-tools";
  tools.innerHTML = '<button type="button" class="vip-sound-toggle" aria-label="كتم الصوت" title="الصوت">🔊</button><button type="button" class="vip-tilt-toggle" aria-label="تفعيل إمالة الهاتف" title="إمالة الهاتف">⌁</button>';
  document.body.append(tools);
  tools.querySelector(".vip-sound-toggle").addEventListener("click", event => {
    soundOn = !soundOn;
    event.currentTarget.textContent = soundOn ? "🔊" : "🔇";
    event.currentTarget.setAttribute("aria-label", soundOn ? "كتم الصوت" : "تشغيل الصوت");
    if (soundOn) tone("tap");
  });

  function applyTilt(x, y) {
    const rx = Math.max(-9, Math.min(9, y));
    const ry = Math.max(-12, Math.min(12, x));
    scene.style.transform = `perspective(1000px) rotateX(${-rx}deg) rotateY(${ry}deg)`;
    scene.classList.add("is-sheened");
  }
  function resetTilt() {
    scene.style.transform = "";
    scene.classList.remove("is-sheened");
  }
  scene.addEventListener("pointermove", event => {
    const rect = scene.getBoundingClientRect();
    applyTilt(((event.clientX - rect.left) / rect.width - .5) * 18, ((event.clientY - rect.top) / rect.height - .5) * 16);
  }, { passive: true });
  scene.addEventListener("pointerleave", resetTilt, { passive: true });
  tools.querySelector(".vip-tilt-toggle").addEventListener("click", async () => {
    if (!window.DeviceOrientationEvent) return;
    try {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== "granted") return;
      }
      if (tiltBound) return;
      tiltBound = true;
      window.addEventListener("deviceorientation", event => {
        if (event.gamma == null || event.beta == null) return;
        applyTilt(event.gamma * .35, (event.beta - 35) * .22);
      }, { passive: true });
      tone("tap");
    } catch (_) { /* Device orientation permission is optional. */ }
  });

  const greeting = document.createElement("div");
  greeting.className = "vip-smart-greeting";
  greeting.setAttribute("aria-live", "polite");
  const updateGreeting = () => {
    const hour = new Date().getHours();
    greeting.textContent = hour >= 5 && hour < 12 ? "صباح الخير" : hour < 18 ? "مساء الخير" : "سهرة سعيدة";
  };
  updateGreeting();
  const hero = document.querySelector("main .hero");
  if (hero) hero.insertAdjacentElement("afterend", greeting);

  const ticker = document.createElement("div");
  ticker.className = "vip-ticker";
  ticker.setAttribute("aria-label", "مزايا وامتيازات أعضاء VIP");
  ticker.innerHTML = '<div class="vip-ticker-track" aria-hidden="true"><span>حجز مباشر وأولوية في اختيار الجلسات</span><span>ضيافة ترحيبية مميزة</span><span>تجربة خاصة في أجواء الخيمة</span><span>حجز مباشر وأولوية في اختيار الجلسات</span><span>ضيافة ترحيبية مميزة</span><span>تجربة خاصة في أجواء الخيمة</span></div>';
  greeting.insertAdjacentElement("afterend", ticker);

  const scratch = document.createElement("div");
  scratch.className = "vip-scratch";
  scratch.innerHTML = '<div class="vip-scratch-prize"><span>🎁 هديتك الترحيبية</span><strong class="vip-scratch-gift">مفاجأة VIP بانتظارك</strong><small>امسح الطبقة الذهبية للكشف عن هديتك</small></div><canvas aria-label="امسح لكشف الهدية" role="img"></canvas>';
  scene.insertAdjacentElement("afterend", scratch);
  const canvas = scratch.querySelector("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  function updateMemberDetails() {
    const id = get("memberId")?.textContent?.trim() || "عضوية الخيمة";
    const name = get("memberName")?.textContent?.trim();
    backDetails.querySelector("strong").textContent = id;
    const gift = get("giftName")?.textContent?.trim();
    if (gift) scratch.querySelector(".vip-scratch-gift").textContent = gift;
    if (name && name !== "لم يتم تفعيل البطاقة بعد") backDetails.querySelectorAll("span")[1].textContent = `مرحباً ${name} • مزايا حصرية`;
  }
  updateMemberDetails();
  const memberObserver = new MutationObserver(updateMemberDetails);
  [get("memberId"), get("memberName"), get("giftName")].filter(Boolean).forEach(node => memberObserver.observe(node, { childList: true, characterData: true, subtree: true }));

  function resizeScratch() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#f6df9e"); gradient.addColorStop(.48, "#bd963f"); gradient.addColorStop(1, "#ead18e");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.font = "700 14px Tahoma,Arial"; ctx.textAlign = "center";
    ctx.fillText("✦  امسح واربح  ✦", rect.width / 2, rect.height / 2 + 5);
    ctx.globalCompositeOperation = "destination-out";
  }
  function scratchAt(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
    const now = performance.now();
    if (now - lastCheck < 220 || scratchRevealed) return;
    lastCheck = now;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i] < 16) cleared++;
    if (cleared / (canvas.width * canvas.height) > .42) revealGift();
    void dpr;
  }
  function revealGift() {
    if (scratchRevealed) return;
    scratchRevealed = true;
    scratch.classList.add("is-revealed");
    haptic(35); tone("reveal"); launchConfetti();
  }
  canvas.addEventListener("pointerdown", event => {
    if (scratchRevealed) return;
    isScratching = true;
    canvas.setPointerCapture?.(event.pointerId);
    scratchAt(event); haptic(8);
  });
  canvas.addEventListener("pointermove", event => { if (isScratching) scratchAt(event); });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(type => canvas.addEventListener(type, () => { isScratching = false; }));
  resizeScratch();
  window.addEventListener("resize", () => { if (!scratchRevealed) resizeScratch(); }, { passive: true });

  function launchConfetti() {
    const confetti = document.createElement("canvas");
    confetti.className = "vip-confetti";
    document.body.append(confetti);
    const c = confetti.getContext("2d");
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    confetti.width = Math.floor(innerWidth * ratio); confetti.height = Math.floor(innerHeight * ratio);
    c.scale(ratio, ratio);
    const particles = Array.from({ length: 42 }, () => ({ x: Math.random() * innerWidth, y: -10 - Math.random() * 100, vx: (Math.random() - .5) * 2.2, vy: 1.5 + Math.random() * 3, size: 3 + Math.random() * 4, rot: Math.random() * 6, color: Math.random() > .35 ? "#d7b66d" : "#fff0bd" }));
    const start = performance.now();
    function frame(now) {
      c.clearRect(0, 0, innerWidth, innerHeight);
      particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.rot += .08; c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = p.color; c.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.8); c.restore(); });
      if (now - start < 1450) requestAnimationFrame(frame); else confetti.remove();
    }
    requestAnimationFrame(frame);
  }

  document.addEventListener("click", event => {
    if (event.target.closest(".vip-flip-trigger,.vip-sound-toggle,.vip-tilt-toggle,.btn,.guest-choice")) {
      if (!event.target.closest(".vip-flip-trigger,.vip-sound-toggle,.vip-tilt-toggle")) { tone("tap"); haptic(12); }
    }
  }, true);
})();
