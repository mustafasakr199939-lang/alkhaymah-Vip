(() => {
  "use strict";
  const style = document.createElement("style");
  style.textContent = `
    .vip-tools{position:fixed;top:82px;left:12px;z-index:80;display:flex;gap:7px}
    .vip-tools button,.vip-flip{border:1px solid #d7b66d99;border-radius:999px;background:#14231fee;color:#f1d9a2;padding:9px 12px;font:700 13px Tahoma,Arial,sans-serif;box-shadow:0 6px 20px #13292224;cursor:pointer;backdrop-filter:blur(10px)}
    .vip-tools button:focus-visible,.vip-flip:focus-visible{outline:3px solid #f1d9a2;outline-offset:3px}
    .vip-card-scene{position:relative;perspective:1100px;margin:10px 0 16px;touch-action:pan-y}
    .vip-card-flipper{position:relative;min-height:230px;transform-style:preserve-3d;transition:transform .72s cubic-bezier(.2,.72,.25,1);will-change:transform}
    .vip-card-scene.is-flipped .vip-card-flipper{transform:rotateY(180deg)}
    .vip-face{position:absolute;inset:0;min-height:230px;border-radius:22px;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden}
    .vip-face.front{z-index:1}.vip-face.back{transform:rotateY(180deg);display:grid;grid-template-columns:130px 1fr;gap:14px;align-items:center;padding:18px;background:radial-gradient(circle at 15% 10%,#d7b66d30,transparent 35%),linear-gradient(135deg,#10251f,#1d4a3d);border:1px solid #d7b66db3;color:#fff;box-shadow:0 18px 38px #13292230}
    .vip-face.front>.vip-card{display:block;height:100%;min-height:230px;cursor:pointer;position:relative;overflow:hidden;transform-style:preserve-3d;transition:box-shadow .2s ease}
    .vip-face.front>.vip-card::after{content:"";position:absolute;inset:-40% -70%;pointer-events:none;background:linear-gradient(110deg,transparent 43%,#fff8 49%,#f1d9a255 52%,transparent 59%);transform:translateX(-35%) rotate(9deg);transition:transform .45s ease}
    .vip-card-scene.is-sheened .vip-face.front>.vip-card::after{transform:translateX(45%) rotate(9deg)}
    .vip-face.front>.vip-card>div:first-child{position:relative;z-index:1}
    .vip-face.back .qr-box{margin:0;width:120px;height:120px;max-width:120px;max-height:120px}.vip-face.back .qr-box canvas,.vip-face.back .qr-box img{max-width:106px;max-height:106px}
    .vip-back-details{display:grid;gap:8px;align-content:center;min-width:0}.vip-back-details strong{color:#f1d9a2;font-size:1.04rem;overflow-wrap:anywhere}.vip-back-details span{font-size:.84rem;color:#ffffffcf}
    .vip-flip{position:absolute;z-index:5;left:10px;bottom:10px;padding:7px 10px;font-size:12px}
    .vip-greeting{display:inline-flex;margin:5px 0 12px;padding:7px 13px;border:1px solid #d7b66d80;border-radius:999px;background:#fff9e8;color:#183c32;font-weight:800}
    .vip-ticker{overflow:hidden;margin:12px 0 18px;border:1px solid #d7b66d99;border-radius:14px;background:#14231f;color:#f7f1e4;white-space:nowrap}.vip-ticker-track{display:flex;width:max-content;animation:vipTickerMove 26s linear infinite}.vip-ticker span{padding:10px 20px;font-size:.82rem}.vip-ticker span::before{content:"✦";color:#f1d9a2;margin-inline-end:9px}@keyframes vipTickerMove{to{transform:translateX(50%)}}
    .vip-scratch{position:relative;isolation:isolate;margin:16px 0 8px;min-height:120px;border:1px solid #d7b66d;border-radius:16px;overflow:hidden;background:linear-gradient(135deg,#fff1bf,#d7b66d 50%,#b88d3f);color:#183c32}.vip-scratch-prize{min-height:120px;display:grid;place-content:center;text-align:center;padding:18px;font-weight:800;gap:4px}.vip-scratch-prize small{font-weight:500}.vip-scratch canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:crosshair}.vip-scratch.is-revealed canvas{opacity:0;pointer-events:none;transition:opacity .4s ease}
    .vip-confetti{position:fixed;inset:0;width:100%;height:100%;z-index:999;pointer-events:none}
    @media(max-width:540px){.vip-tools{top:72px;left:8px}.vip-face.back{grid-template-columns:104px 1fr;padding:12px;gap:10px}.vip-face.back .qr-box{width:100px;height:100px}.vip-face.back .qr-box canvas,.vip-face.back .qr-box img{max-width:88px;max-height:88px}.vip-card-flipper,.vip-face,.vip-face.front>.vip-card{min-height:215px}}
    @media(prefers-reduced-motion:reduce){.vip-card-flipper,.vip-ticker-track,.vip-face.front>.vip-card::after{transition:none!important;animation:none!important}}
  `;
  document.head.append(style);
  const byId = id => document.getElementById(id);
  const card = byId("vipCard");
  if (!card || card.dataset.vipEnhanced) return;
  card.dataset.vipEnhanced = "true";
  let soundOn = true, audio, scratching = false, revealed = false, lastCheck = 0, gyroEnabled = false;
  const haptic = (ms = 16) => { if (navigator.vibrate) navigator.vibrate(ms); };
  function tone(reward = false) {
    if (!soundOn) return;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    try {
      audio ||= new AudioCtor(); if (audio.state === "suspended") audio.resume();
      const now = audio.currentTime, osc = audio.createOscillator(), gain = audio.createGain();
      osc.type = reward ? "sine" : "triangle"; osc.frequency.setValueAtTime(reward ? 660 : 880, now);
      if (reward) osc.frequency.exponentialRampToValueAtTime(990, now + .16);
      gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.035, now + .015); gain.gain.exponentialRampToValueAtTime(.0001, now + .2);
      osc.connect(gain); gain.connect(audio.destination); osc.start(now); osc.stop(now + .21);
    } catch (_) { /* Audio remains an optional enhancement. */ }
  }

  const scene = document.createElement("div"); scene.className = "vip-card-scene"; scene.setAttribute("role", "group"); scene.setAttribute("aria-label", "بطاقة VIP التفاعلية؛ اضغط لعرض الخلف");
  const flipper = document.createElement("div"); flipper.className = "vip-card-flipper";
  const front = document.createElement("div"); front.className = "vip-face front";
  const back = document.createElement("div"); back.className = "vip-face back";
  const details = document.createElement("div"); details.className = "vip-back-details"; details.innerHTML = '<strong>عضوية الخيمة</strong><span>امسح رمز QR للتحقق من عضويتك</span><span>ضيافة • حجز مميز • امتيازات خاصة</span>';
  const qr = byId("qrcode"); if (qr) back.append(qr); back.append(details);
  card.parentNode.insertBefore(scene, card); front.append(card); flipper.append(front, back); scene.append(flipper);
  const flip = document.createElement("button"); flip.type = "button"; flip.className = "vip-flip"; flip.textContent = "اقلب البطاقة ↻"; flip.setAttribute("aria-pressed", "false"); scene.append(flip);
  card.setAttribute("role", "button"); card.setAttribute("tabindex", "0"); card.setAttribute("aria-label", "اقلب بطاقة العضوية لعرض رمز QR");
  function flipCard() { const state = scene.classList.toggle("is-flipped"); flip.setAttribute("aria-pressed", String(state)); flip.textContent = state ? "الوجه الأمامي ↻" : "اقلب البطاقة ↻"; haptic(20); tone(); }
  flip.addEventListener("click", flipCard);
  card.addEventListener("click", event => { if (!event.target.closest("button,a,input")) flipCard(); });
  card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); flipCard(); } });

  const tools = document.createElement("div"); tools.className = "vip-tools"; tools.innerHTML = '<button type="button" class="vip-sound" aria-label="كتم الصوت" title="الصوت">🔊</button><button type="button" class="vip-gyro" aria-label="تفعيل إمالة الهاتف" title="إمالة الهاتف">⌁</button>'; document.body.append(tools);
  tools.querySelector(".vip-sound").addEventListener("click", event => { soundOn = !soundOn; event.currentTarget.textContent = soundOn ? "🔊" : "🔇"; event.currentTarget.setAttribute("aria-label", soundOn ? "كتم الصوت" : "تشغيل الصوت"); if (soundOn) tone(); });
  function tilt(x, y) { scene.style.transform = `perspective(1000px) rotateX(${Math.max(-9, Math.min(9, -y))}deg) rotateY(${Math.max(-12, Math.min(12, x))}deg)`; scene.classList.add("is-sheened"); }
  scene.addEventListener("pointermove", event => { const r = scene.getBoundingClientRect(); tilt(((event.clientX - r.left) / r.width - .5) * 18, ((event.clientY - r.top) / r.height - .5) * 16); }, { passive: true });
  scene.addEventListener("pointerleave", () => { scene.style.transform = ""; scene.classList.remove("is-sheened"); }, { passive: true });
  tools.querySelector(".vip-gyro").addEventListener("click", async () => {
    if (!window.DeviceOrientationEvent || gyroEnabled) return;
    try {
      if (typeof DeviceOrientationEvent.requestPermission === "function" && await DeviceOrientationEvent.requestPermission() !== "granted") return;
      gyroEnabled = true;
      window.addEventListener("deviceorientation", event => { if (event.gamma != null && event.beta != null) tilt(event.gamma * .35, (event.beta - 35) * .22); }, { passive: true });
      tone();
    } catch (_) { /* Sensor access is optional and permission-gated. */ }
  });

  const greeting = document.createElement("div"); greeting.className = "vip-greeting"; greeting.setAttribute("aria-live", "polite");
  const hour = new Date().getHours(); greeting.textContent = hour >= 5 && hour < 12 ? "صباح الخير" : hour < 18 ? "مساء الخير" : "سهرة سعيدة";
  const hero = document.querySelector("main .hero"); if (hero) hero.insertAdjacentElement("afterend", greeting);
  const ticker = document.createElement("div"); ticker.className = "vip-ticker"; ticker.setAttribute("aria-label", "مزايا وامتيازات أعضاء VIP"); ticker.innerHTML = '<div class="vip-ticker-track" aria-hidden="true"><span>أولوية اختيار الجلسات والحجز المباشر</span><span>ضيافة ترحيبية مميزة</span><span>أجواء خاصة وتجربة استثنائية</span><span>أولوية اختيار الجلسات والحجز المباشر</span><span>ضيافة ترحيبية مميزة</span><span>أجواء خاصة وتجربة استثنائية</span></div>'; greeting.insertAdjacentElement("afterend", ticker);

  const scratch = document.createElement("div"); scratch.className = "vip-scratch"; scratch.innerHTML = '<div class="vip-scratch-prize"><span>🎁 هديتك الترحيبية</span><strong class="vip-scratch-gift">مفاجأة VIP بانتظارك</strong><small>امسح الطبقة الذهبية للكشف عن هديتك</small></div><canvas aria-label="امسح لكشف الهدية"></canvas>'; scene.insertAdjacentElement("afterend", scratch);
  const canvas = scratch.querySelector("canvas"), ctx = canvas.getContext("2d", { willReadFrequently: true });
  function syncPass() {
    const id = byId("memberId")?.textContent?.trim() || "عضوية الخيمة", name = byId("memberName")?.textContent?.trim(), gift = byId("giftName")?.textContent?.trim();
    details.querySelector("strong").textContent = id;
    if (gift) scratch.querySelector(".vip-scratch-gift").textContent = gift;
    if (name && name !== "لم يتم تفعيل البطاقة بعد") details.querySelectorAll("span")[1].textContent = `مرحباً ${name} • مزايا حصرية`;
  }
  syncPass();
  const observer = new MutationObserver(syncPass);
  ["memberId", "memberName", "giftName"].map(byId).filter(Boolean).forEach(node => observer.observe(node, { childList: true, characterData: true, subtree: true }));
  function resizeScratch() {
    const r = canvas.getBoundingClientRect(); if (!r.width || !r.height) return;
    const dpr = Math.min(devicePixelRatio || 1, 1.5); canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, r.width, r.height); g.addColorStop(0, "#f6df9e"); g.addColorStop(.48, "#bd963f"); g.addColorStop(1, "#ead18e");
    ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = g; ctx.fillRect(0, 0, r.width, r.height); ctx.fillStyle = "rgba(255,255,255,.62)"; ctx.font = "700 14px Tahoma,Arial"; ctx.textAlign = "center"; ctx.fillText("✦  امسح واربح  ✦", r.width / 2, r.height / 2 + 5); ctx.globalCompositeOperation = "destination-out";
  }
  function confetti() {
    const c = document.createElement("canvas"); c.className = "vip-confetti"; document.body.append(c); const x = c.getContext("2d"), d = Math.min(devicePixelRatio || 1, 1.5); c.width = innerWidth * d; c.height = innerHeight * d; x.scale(d, d);
    const ps = Array.from({ length: 36 }, () => ({ x: Math.random() * innerWidth, y: -Math.random() * 100, vx: (Math.random() - .5) * 2, vy: 1.5 + Math.random() * 3, size: 3 + Math.random() * 4, rot: Math.random() * 6, color: Math.random() > .35 ? "#d7b66d" : "#fff0bd" })), start = performance.now();
    function draw(now) { x.clearRect(0, 0, innerWidth, innerHeight); ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.rot += .08; x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.fillStyle = p.color; x.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.8); x.restore(); }); if (now - start < 1300) requestAnimationFrame(draw); else c.remove(); }
    requestAnimationFrame(draw);
  }
  function reveal() { if (revealed) return; revealed = true; scratch.classList.add("is-revealed"); haptic(35); tone(true); confetti(); }
  function scratchPoint(event) {
    const r = canvas.getBoundingClientRect(); ctx.beginPath(); ctx.arc(event.clientX - r.left, event.clientY - r.top, 22, 0, Math.PI * 2); ctx.fill();
    const now = performance.now(); if (now - lastCheck < 220 || revealed) return; lastCheck = now;
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data; let cleared = 0; for (let i = 3; i < pixels.length; i += 4) if (pixels[i] < 16) cleared++;
    if (cleared / (canvas.width * canvas.height) > .42) reveal();
  }
  canvas.addEventListener("pointerdown", event => { if (revealed) return; scratching = true; canvas.setPointerCapture?.(event.pointerId); scratchPoint(event); haptic(8); });
  canvas.addEventListener("pointermove", event => { if (scratching) scratchPoint(event); });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(type => canvas.addEventListener(type, () => { scratching = false; }));
  resizeScratch(); window.addEventListener("resize", () => { if (!revealed) resizeScratch(); }, { passive: true });
  document.addEventListener("click", event => { if (event.target.closest(".btn,.guest-choice") && !event.target.closest(".vip-flip,.vip-sound,.vip-gyro")) { tone(); haptic(12); } }, true);
})();
