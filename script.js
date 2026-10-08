/* =====================================================================
   ✏️  CONFIGURATION — shudhu ei part edit korlei hobe
   ===================================================================== */
const CONFIG = {
  name: "Nighu",
  birthday: { month: 10, day: 9 },          // 9 October (Bangladesh time, 12:00 AM)
  audio: "assets/audio/happy-birthday.mp3", // nijer song boshate chaile ei nam e file rakhun
  titleText: "Happy Birthday to You, Nighu ❤️",
  shortMessage: "Today is all about you, Nighu. May your smile always stay this beautiful, and may every moment of your life be filled with happiness. ❤️",
  heroTitle: "Happy Birthday, My Nighu ❤️",
  heroSub: "A little surprise, made only for you.",
  photoCaption: "My favourite person, my favourite memory.",
  longMessage:
`Nighu,

Thank you for being the calm in my chaos and the smile at the end of my day.
Every ordinary moment feels special because you are in it.

On your birthday I wish you all the happiness you give to everyone around you. May this year be softer, brighter and full of the little things that make you smile.

I love you, today and every day. ❤️`,
  memories: [   // je koyta khushi add/remove korte paren. photo optional: "assets/m1.jpg"
    { date: "The day we met",  title: "Where it all began",     text: "Write a small memory here.", photo: "" },
    { date: "Our first trip",  title: "Just the two of us",     text: "Write a small memory here.", photo: "" },
    { date: "A day I remember",title: "Something you said",     text: "Write a small memory here.", photo: "" },
    { date: "Today",           title: "Your birthday, Nighu",   text: "Another year of you. I'm so grateful.", photo: "" }
  ],
  finalMessage: "No matter how many birthdays come and go,\nI will always be grateful that I get to celebrate yours with you. ❤️",
  theme: { fireworkHues: [330, 345, 280, 40, 300, 200], heart: "❤", heartColors: ["#ff8fab", "#ffb3c7", "#c9a7ff", "#ffd9a0"] }
};
/* ===================================================================== */

const $ = id => document.getElementById(id);
const TZ = 6 * 3600e3;                                   // Asia/Dhaka = UTC+6 (no DST)
const q = new URLSearchParams(location.search);

/* ---------- Time (Dhaka, device-timezone independent) ---------- */
const dhakaYear = new Date(Date.now() + TZ).getUTCFullYear();
let target = Date.UTC(dhakaYear, CONFIG.birthday.month - 1, CONFIG.birthday.day) - TZ;   // 00:00 Dhaka
if (q.has("test")) target = Date.now() + (+q.get("test") || 8) * 1000;                    // ?test=8
const started = () => Date.now() >= target;

function show(id){ document.querySelectorAll(".screen").forEach(s => s.classList.remove("active")); $(id).classList.add("active"); }

/* ---------- Music ---------- */
const audio = new Audio(CONFIG.audio); audio.loop = true; audio.preload = "auto";
let actx, synthTimer, useSynth = false, isPlaying = false, wantPlay = false;
audio.addEventListener("error", () => { useSynth = true; if (wantPlay && !isPlaying) playMusic(); });
audio.load();
const F = {G4:392,A4:440,B4:493.9,C5:523.3,D5:587.3,E5:659.3,F5:698.5,G5:784};
const TUNE = [["G4",.75],["G4",.25],["A4",1],["G4",1],["C5",1],["B4",2],["G4",.75],["G4",.25],["A4",1],["G4",1],["D5",1],["C5",2],
  ["G4",.75],["G4",.25],["G5",1],["E5",1],["C5",1],["B4",1],["A4",2],["F5",.75],["F5",.25],["E5",1],["C5",1],["D5",1],["C5",2]];
function synthLoop(){
  let t = actx.currentTime + .05;
  TUNE.forEach(([n,d]) => { const o = actx.createOscillator(), g = actx.createGain(), L = d * .5;
    o.type = "triangle"; o.frequency.value = F[n]; g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(.22, t + .03); g.gain.exponentialRampToValueAtTime(.001, t + L * .95);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + L); t += L; });
  synthTimer = setTimeout(synthLoop, (t - actx.currentTime) * 1000 + 1200);
}
async function playMusic(){
  wantPlay = true;
  if (!useSynth) {
    try { await audio.play(); isPlaying = true; }
    catch (e) { if (e.name !== "NotAllowedError") useSynth = true; }            // blocked -> wait for first tap
  }
  if (useSynth && !isPlaying) {
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); await actx.resume();
      if (actx.state === "running") { synthLoop(); isPlaying = true; } } catch (e) {}
  }
  $("music").classList.toggle("on", isPlaying);
}
function stopMusic(){ wantPlay = false; isPlaying = false; audio.pause(); clearTimeout(synthTimer); if (actx) actx.suspend(); $("music").classList.remove("on"); }
addEventListener("pointerdown", () => { if (wantPlay && !isPlaying) playMusic(); });     // retry on first interaction
$("music").onclick = () => isPlaying ? stopMusic() : playMusic();
function unlock(){   // called from the first tap so later autoplay at 12:00 is allowed
  try { actx = new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); } catch (e) {}
  audio.muted = true; audio.play().then(() => { audio.pause(); audio.currentTime = 0; audio.muted = false; }).catch(() => { audio.muted = false; });
}

/* ---------- Fireworks + confetti (canvas, behind text) ---------- */
const cv = $("fx"), cx = cv.getContext("2d"), dpr = Math.min(devicePixelRatio || 1, 2);
let rockets = [], sparks = [], confetti = [], fxOn = false, rate = .06;
const fit = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; }; addEventListener("resize", fit); fit();
const pick = a => a[Math.random() * a.length | 0];
function launch(){ const W = cv.width, H = cv.height;
  rockets.push({ x: W * (.08 + Math.random() * .84), y: H, vx: (Math.random() - .5) * 2 * dpr, vy: -(H / 62) * (.85 + Math.random() * .35),
    ty: H * (.1 + Math.random() * .4), hue: pick(CONFIG.theme.fireworkHues), big: Math.random() < .3 }); }
function explode(r){
  const n = r.big ? 130 : 70, sp = (r.big ? 5.2 : 3.6) * dpr, ring = Math.random() < .35;
  for (let i = 0; i < n; i++) { const a = i / n * 6.283, v = ring ? sp : sp * (.25 + Math.random() * .85);
    sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, hue: r.hue + Math.random() * 30 - 15, px: r.x, py: r.y }); }
}
function addConfetti(n){ for (let i = 0; i < n; i++) confetti.push({ x: Math.random() * cv.width, y: -20 * dpr, vx: (Math.random() - .5) * 1.4 * dpr,
  vy: (1 + Math.random() * 2) * dpr, rot: Math.random() * 6, vr: (Math.random() - .5) * .2, c: pick(CONFIG.theme.heartColors), s: (4 + Math.random() * 5) * dpr }); }
function loop(){
  if (!fxOn && !sparks.length && !rockets.length && !confetti.length) return;
  cx.globalCompositeOperation = "destination-out"; cx.fillStyle = "rgba(0,0,0,.22)"; cx.fillRect(0, 0, cv.width, cv.height);
  cx.globalCompositeOperation = "lighter";
  if (fxOn && Math.random() < rate) launch();
  if (fxOn && Math.random() < .05) addConfetti(1);
  rockets = rockets.filter(r => { const px = r.x, py = r.y; r.x += r.vx; r.y += r.vy; r.vy *= .982;
    cx.strokeStyle = "hsla(" + r.hue + ",100%,80%,.9)"; cx.lineWidth = 2.2 * dpr; cx.beginPath(); cx.moveTo(px, py); cx.lineTo(r.x, r.y); cx.stroke();
    if (r.y <= r.ty || r.vy > -2) { explode(r); return false; } return true; });
  sparks = sparks.filter(p => { p.px = p.x; p.py = p.y; p.x += p.vx; p.y += p.vy; p.vy += .035 * dpr; p.vx *= .984; p.vy *= .984; p.life -= .011;
    cx.strokeStyle = "hsla(" + p.hue + ",100%,65%," + Math.max(p.life, 0) + ")"; cx.lineWidth = 2 * dpr; cx.lineCap = "round";
    cx.beginPath(); cx.moveTo(p.px, p.py); cx.lineTo(p.x, p.y); cx.stroke(); return p.life > 0; });
  cx.globalCompositeOperation = "source-over";
  confetti = confetti.filter(c => { c.x += c.vx; c.y += c.vy; c.rot += c.vr; cx.save(); cx.translate(c.x, c.y); cx.rotate(c.rot);
    cx.fillStyle = c.c; cx.globalAlpha = .75; cx.fillRect(-c.s / 2, -c.s / 4, c.s, c.s / 2); cx.restore(); return c.y < cv.height + 20; });
  requestAnimationFrame(loop);
}
function fireworks(on, r = .06){ rate = r; if (on && !fxOn) { fxOn = true; loop(); } if (!on) fxOn = false; }

/* ---------- Floating hearts ---------- */
function heart(x, fromY){
  const h = document.createElement("i"), s = 12 + Math.random() * 22;
  h.textContent = CONFIG.theme.heart; h.style.cssText = `left:${x ?? Math.random() * 100}%;font-size:${s}px;color:${pick(CONFIG.theme.heartColors)};opacity:${.35 + Math.random() * .5};` +
    `--dx:${(Math.random() - .5) * 120}px;--r:${(Math.random() - .5) * 90}deg;animation-duration:${7 + Math.random() * 8}s;text-shadow:0 0 12px currentColor` + (fromY ? `;bottom:${fromY}px` : "");
  $("hearts").appendChild(h); setTimeout(() => h.remove(), 16000);
}
let heartTimer; const hearts = (on, ms = 900) => { clearInterval(heartTimer); if (on) heartTimer = setInterval(() => heart(), ms); };

/* ---------- Flow ---------- */
function celebrate(){
  show("celebrate"); $("music").hidden = false;
  const t = $("title"); t.innerHTML = ""; let i = 0;
  CONFIG.titleText.split(" ").forEach(word => { const w = document.createElement("span"); w.className = "w"; w.style.opacity = 1;
    [...word].forEach(ch => { const s = document.createElement("span"); s.textContent = ch; s.style.animationDelay = (.3 + i++ * .07) + "s"; w.appendChild(s); });
    t.append(w, " "); i++; });
  $("short").textContent = CONFIG.shortMessage;
  fireworks(true, .09); addConfetti(60); hearts(true, 700); playMusic();
}
$("thanks").onclick = e => {
  const r = e.target.getBoundingClientRect(); for (let k = 0; k < 24; k++) heart((r.left + r.width / 2) / innerWidth * 100, innerHeight - r.top - 20);
  addConfetti(80); $("celebrate").classList.add("leave"); fireworks(false);
  setTimeout(() => { $("celebrate").classList.remove("leave"); show("site"); hearts(true, 1400); watchTimeline(); $("site").scrollTop = 0; }, 900);
};
$("again").onclick = () => { $("site").classList.remove("active"); $("site").style.display = "none"; setTimeout(() => { $("site").style.display = ""; celebrate(); }, 300); };

let tick;
function wait(){
  show("wait"); const p = n => String(n).padStart(2, "0");
  const draw = () => { const left = target - Date.now(); if (left <= 0) { clearInterval(tick); celebrate(); return; }
    const s = Math.ceil(left / 1000), d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600);
    $("clock").innerHTML = (d ? `<div><b>${d}</b><i>days</i></div>` : "") +
      `<div><b>${p(h)}</b><i>hours</i></div><div><b>${p(Math.floor(s % 3600 / 60))}</b><i>minutes</i></div><div><b>${p(s % 60)}</b><i>seconds</i></div>`; };
  draw(); tick = setInterval(draw, 250); hearts(true, 1800);
}
$("gateBtn").onclick = () => { unlock(); hearts(false); started() ? celebrate() : wait(); };
$("gateText").textContent = started() ? "A surprise is waiting for you, " + CONFIG.name : "A little surprise for " + CONFIG.name;
if (q.get("preview") === "site") { show("site"); setTimeout(watchTimeline, 0); }

/* ---------- Content ---------- */
$("heroTitle").textContent = CONFIG.heroTitle; $("heroSub").textContent = CONFIG.heroSub;
$("caption").textContent = CONFIG.photoCaption; $("long").textContent = CONFIG.longMessage; $("final").textContent = CONFIG.finalMessage;
function watchTimeline(){ if (!window.IntersectionObserver) { document.querySelectorAll("#tl li").forEach(li => li.classList.add("in")); return; } const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add("in")), { root: $("site"), threshold: .25 });
  document.querySelectorAll("#tl li").forEach(li => io.observe(li)); }
for (let k = 0; k < 3; k++) setTimeout(() => $("site").addEventListener("scroll", () => Math.random() < .08 && heart(), { passive: true }), 0);

/* ---------- Photo upload (IndexedDB, 100% client-side) ---------- */
const idb = () => new Promise((ok, no) => { const r = indexedDB.open("nighu-birthday", 1);
  r.onupgradeneeded = () => r.result.createObjectStore("kv"); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
const kv = async (mode, key, val) => { const d = await idb(); return new Promise((ok, no) => { const st = d.transaction("kv", mode === "get" ? "readonly" : "readwrite").objectStore("kv");
  const rq = mode === "get" ? st.get(key) : st.put(val, key); rq.onsuccess = () => ok(rq.result); rq.onerror = () => no(rq.error); }); };
const placeholder = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect width="100%" height="100%" fill="#3a1a5e"/><text x="50%" y="50%" text-anchor="middle" fill="#ffd9a0" font-size="64">❤</text></svg>');
let picUrl; const setPic = blob => { if (picUrl) URL.revokeObjectURL(picUrl); picUrl = URL.createObjectURL(blob); $("pic").src = picUrl; };
$("pic").src = placeholder;
kv("get", "photo").then(b => b && setPic(b)).catch(() => {});
$("file").onchange = e => { const f = e.target.files[0]; if (!f) return; const img = new Image(), u = URL.createObjectURL(f);
  img.onload = () => { const k = Math.min(1, 1400 / Math.max(img.width, img.height)), c = document.createElement("canvas");
    c.width = img.width * k; c.height = img.height * k; c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
    c.toBlob(b => { setPic(b); kv("put", "photo", b).catch(() => alert("Photo ei browser e save kora gelo na (private mode?).")); }, "image/jpeg", .9); };
  img.src = u; };

/* ---------- Memories: 4 ta photo ekshathe upload (IndexedDB) ---------- */
const shrink = (f, max = 1200) => new Promise(ok => { const img = new Image(), u = URL.createObjectURL(f);
  img.onload = () => { const k = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement("canvas");
    c.width = img.width * k; c.height = img.height * k; c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
    c.toBlob(ok, "image/jpeg", .88); }; img.src = u; });
const N = CONFIG.memories.length;
$("tl").innerHTML = CONFIG.memories.map((m, i) => `<li><time>${m.date}</time><h4>${m.title}</h4><p>${m.text}</p>` +
  `<img class="mp" data-i="${i}" src="${m.photo || placeholder}" alt="Memory ${i + 1}" title="Tap to change this photo"></li>`).join("");
const memImg = i => document.querySelector(`.mp[data-i="${i}"]`);
const setMem = (i, blob) => { const el = memImg(i); if (!el) return; if (el.dataset.u) URL.revokeObjectURL(el.dataset.u); el.dataset.u = URL.createObjectURL(blob); el.src = el.dataset.u; };
CONFIG.memories.forEach((_, i) => kv("get", "mem" + i).then(b => b && setMem(i, b)).catch(() => {}));
$("memHint").textContent = `Ekshathe ${N} ta photo select korun, order onujayi boshe jabe. Kono ekta photo tap korle shudhu oita change hobe.`;
let only = null;
$("memFiles").onchange = async e => { const files = [...e.target.files].slice(0, only === null ? N : 1);
  for (let j = 0; j < files.length; j++) { const i = only === null ? j : only, b = await shrink(files[j]); setMem(i, b); kv("put", "mem" + i, b).catch(() => {}); }
  e.target.value = ""; only = null; $("memFiles").multiple = true; };
$("tl").addEventListener("click", e => { const t = e.target.closest(".mp"); if (!t) return; only = +t.dataset.i; $("memFiles").multiple = false; $("memFiles").click(); });