/**
 * Фото:
 * - Я уже скопировал твои 29 фото в `photos/` и переименовал в `1.jpeg … 29.jpeg`.
 * - Если захочешь заменить/добавить — просто клади файлы в `photos/` и поправь генерацию ниже.
 */
const ALL_PHOTOS = Array.from({ length: 29 }, (_, i) => `photos/${i + 1}.jpeg`);
// Книга: первые 6 фото (3 разворота по 2)
const BOOK_PHOTOS = ALL_PHOTOS.slice(0, 6);
// Сердце: оставшиеся 23 фото
const HEART_PHOTOS = ALL_PHOTOS.slice(6);

/** развороты: pair = две фотографии рядом без шва; подпись внизу */
const SPREADS = [
  {
    kind: "cover",
    title: "Сабина",
    subtitle: "твой день · твоя история",
    age: "17",
  },
  {
    kind: "text",
    chapter: "Слово в начало",
    html: "Сабина, в этот день хочется сказать не «формально красиво», а по-настоящему.<br/><br/>Тебе <strong>17</strong> — возраст, когда ещё можно всё переписать, если захочешь. Пусть <strong>13&nbsp;апреля</strong> станет тихой отметкой: <em>«вот тогда мне пожелали по-честному»</em>.",
  },
  ...BOOK_PHOTOS.reduce((acc, _src, idx, arr) => {
    if (idx % 2 !== 0) return acc;
    const left = arr[idx];
    const right = arr[idx + 1] || arr[idx];
    acc.push({
      kind: "pair",
      left,
      right,
      caption:
        idx === 0
          ? "Каждый разворот — как маленький архив тепла. Ты в кадре — и мир будто на секунду становится мягче."
          : "Пусть этот день запомнится не шумом, а теплом — как будто кто-то бережно держит твою ладонь.",
    });
    return acc;
  }, []),
  {
    kind: "text",
    chapter: "Про тебя",
    html: "Ты не обязана быть «удобной» миру каждый день. Достаточно быть собой — мягкой, смелой, уставшей, сияющей.<br/><br/>Пусть в этом году у тебя будет больше моментов, когда ты думаешь не «я должна», а <strong>«я хочу»</strong>.",
  },
  {
    kind: "text",
    chapter: "Послание",
    html: "С днём рождения.<br/><br/>Желаю тебе опору внутри, людей рядом без условий и уважение к своим чувствам.<br/><br/><strong>Просто будь счастлива.</strong> По-настоящему. Ты этого стоишь. ♡",
  },
  {
    kind: "final",
    chapter: "Последняя страница",
    html: "Если бы пожелания складывались в коробку, твоя была бы самой тяжёлой.<br/><br/>Пусть этот год будет как хороший роман — с теплом и сюжетом, который хочется перечитывать. <strong>Ты — главная героиня.</strong>",
  },
];

function el(tag, className, text) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text != null) n.textContent = text;
  return n;
}

// ——— Матрица (розовая) ———
const matrixPhrase = "HAPPY BIRTHDAY TO SABINA ";
const matrixState = { raf: 0, cols: [], running: false };

function matrixResize(canvas) {
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const colW = 15;
  const n = Math.ceil(w / colW) + 1;
  matrixState.cols = [];
  for (let i = 0; i < n; i++) {
    matrixState.cols.push({
      x: i * colW,
      y: Math.random() * -h - 50,
      speed: 0.85 + Math.random() * 2.1,
      len: 14 + Math.floor(Math.random() * 16),
    });
  }
}

function matrixLoop(canvas) {
  if (!matrixState.running) return;
  const ctx = canvas.getContext("2d");
  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.fillStyle = "rgba(0,0,0,0.14)";
  ctx.fillRect(0, 0, w, h);
  const colW = 15;
  const fh = 15;
  ctx.font = `600 ${Math.max(12, colW - 2)}px ui-monospace, "Cascadia Code", monospace`;

  matrixState.cols.forEach((col, ci) => {
    col.y += col.speed;
    if (col.y > h + col.len * fh) {
      col.y = -Math.random() * h * 0.5 - 40;
      col.speed = 0.85 + Math.random() * 2.1;
      col.len = 14 + Math.floor(Math.random() * 16);
    }
    for (let i = 0; i < col.len; i++) {
      const y = col.y - i * fh;
      if (y < -fh || y > h + fh) continue;
      const idx = (ci * 11 + i + Math.floor(col.y * 0.15)) % matrixPhrase.length;
      const ch = matrixPhrase[idx] || "*";
      if (i === 0) {
        ctx.fillStyle = "#fff0f8";
        ctx.shadowColor = "#ff1493";
        ctx.shadowBlur = 12;
      } else {
        const t = i / col.len;
        ctx.fillStyle = `rgba(255, ${40 + i * 8}, ${220 - i * 4}, ${0.25 + (1 - t) * 0.65})`;
        ctx.shadowBlur = 0;
      }
      ctx.fillText(ch, col.x, y);
    }
    ctx.shadowBlur = 0;
  });

  matrixState.raf = requestAnimationFrame(() => matrixLoop(canvas));
}

function startMatrix(canvas) {
  matrixState.running = true;
  matrixResize(canvas);
  matrixLoop(canvas);
}

function stopMatrix() {
  matrixState.running = false;
  if (matrixState.raf) cancelAnimationFrame(matrixState.raf);
  matrixState.raf = 0;
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runIntro() {
  const canvas = document.getElementById("matrix-canvas");
  const center = document.getElementById("intro-center");
  const screen = document.getElementById("screen-intro");

  const onResize = () => {
    if (matrixState.running) matrixResize(canvas);
  };
  window.addEventListener("resize", onResize);
  startMatrix(canvas);

  for (const n of [3, 2, 1]) {
    center.textContent = String(n);
    center.className = "intro-center";
    await wait(950);
  }
  center.textContent = "";

  const words = ["HAPPY", "BIRTHDAY", "TO", "SABINA"];
  for (const w of words) {
    center.textContent = w;
    center.className = "intro-center intro-center--word";
    await wait(1000);
  }

  stopMatrix();
  window.removeEventListener("resize", onResize);
  screen.hidden = true;
}

function buildCandleRow(container, word) {
  container.innerHTML = "";
  let idx = 0;
  for (const ch of word) {
    if (ch === " ") continue;
    const span = document.createElement("span");
    span.className = `cat-letter cat-letter--c${idx % 8}`;
    span.textContent = ch;
    container.appendChild(span);
    idx++;
  }
}

function runCatScene() {
  return new Promise((resolve) => {
    buildCandleRow(document.getElementById("candle-row-1"), "HAPPY");
    buildCandleRow(document.getElementById("candle-row-2"), "BIRTHDAY");

    const cat = document.getElementById("screen-cat");
    cat.hidden = false;

    const done = () => {
      cat.hidden = true;
      resolve();
    };
    const t = window.setTimeout(done, 7500);
    cat.addEventListener(
      "click",
      () => {
        window.clearTimeout(t);
        done();
      },
      { once: true }
    );
  });
}

function drawStars(canvas) {
  const ctx = canvas.getContext("2d");
  const parent = canvas.parentElement;
  const w = Math.max(canvas.clientWidth, parent?.clientWidth || 0, 300);
  const h = Math.max(canvas.clientHeight, parent?.clientHeight || 0, 200);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h * 0.7;
    const r = Math.random() * 1.4 + 0.15;
    const a = Math.random() * 0.65 + 0.12;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,245,${a})`;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function buildSpreadFront(data) {
  const wrap = el("div", "spread-wrap");

  if (data.kind === "cover") {
    wrap.classList.add("spread--cover");
    const inner = el("div", "spread-cover-inner");
    inner.appendChild(el("p", "cover-mark", data.title));
    const sub = el("p", "cover-sub", data.subtitle);
    inner.appendChild(sub);
    const age = el("p", "cover-age", data.age);
    inner.appendChild(age);
    const tip = el("p", "caption", "Нажми на книгу — дальше ✨");
    tip.style.marginTop = "1.2rem";
    tip.style.fontStyle = "italic";
    tip.style.color = "var(--ink-soft)";
    inner.appendChild(tip);
    wrap.appendChild(inner);
    return wrap;
  }

  if (data.kind === "pair") {
    const grid = el("div", "spread-grid");
    const imgL = document.createElement("img");
    imgL.className = "spread-img";
    imgL.src = data.left;
    imgL.alt = "Сабина";
    const imgR = document.createElement("img");
    imgR.className = "spread-img";
    imgR.src = data.right;
    imgR.alt = "Сабина";
    grid.appendChild(imgL);
    grid.appendChild(imgR);
    wrap.appendChild(grid);
    if (data.caption) {
      const p = el("p", "spread-foot");
      p.innerHTML = data.caption;
      wrap.appendChild(p);
    }
    return wrap;
  }

  if (data.kind === "text" || data.kind === "final") {
    wrap.classList.add("spread--text");
    const inner = el("div", `spread-text-inner${data.kind === "final" ? " spread-text-inner--final" : ""}`);
    inner.style.position = data.kind === "final" ? "relative" : "";
    if (data.kind === "final") {
      const canvas = el("canvas", "stars-canvas");
      inner.appendChild(canvas);
      queueMicrotask(() => {
        drawStars(canvas);
        if (typeof ResizeObserver !== "undefined") {
          const ro = new ResizeObserver(() => drawStars(canvas));
          ro.observe(inner);
        }
      });
    }
    inner.appendChild(el("p", "chapter", data.chapter));
    const body = el("p", "message-body");
    body.innerHTML = data.html;
    inner.appendChild(body);
    wrap.appendChild(inner);
    return wrap;
  }

  return wrap;
}

function renderSpreadBook(root) {
  const total = SPREADS.length;
  SPREADS.forEach((data, i) => {
    const z = total - i;
    const page = el("div", "page");
    page.style.setProperty("--z", String(z));
    if (i === 0) page.classList.add("is-top");

    const inner = el("div", "page-inner");
    const front = el("div", "face face--front");
    const back = el("div", "face face--back");
    front.appendChild(buildSpreadFront(data));
    inner.appendChild(front);
    inner.appendChild(back);
    page.appendChild(inner);
    root.appendChild(page);
  });
}

function setupProgress(count) {
  const bar = document.getElementById("progress");
  bar.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const d = el("span");
    d.setAttribute("role", "presentation");
    bar.appendChild(d);
  }
  return bar.querySelectorAll("span");
}

function updateProgress(dots, idx) {
  dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
}

function fillFinaleMotes(container) {
  container.innerHTML = "";
  const n = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 4 : 14;
  for (let i = 0; i < n; i++) {
    const m = document.createElement("span");
    m.className = "finale-mote";
    m.style.left = `${6 + Math.random() * 88}%`;
    m.style.setProperty("--delay", `${Math.random() * 6}s`);
    m.style.setProperty("--dur", `${9 + Math.random() * 10}s`);
    m.style.setProperty("--dx", `${Math.random() * 80 - 40}px`);
    container.appendChild(m);
  }
}

function openFinaleGift() {
  const root = document.getElementById("finale-gift");
  const motes = document.getElementById("finale-motes");
  const seal = document.getElementById("finale-seal");
  const reveal = document.getElementById("finale-reveal");
  fillFinaleMotes(motes);
  seal.classList.remove("is-open");
  seal.hidden = false;
  reveal.hidden = true;
  root.hidden = false;
  document.body.style.overflow = "hidden";
  queueMicrotask(() => seal.focus({ preventScroll: true }));
}

function closeFinaleGift() {
  document.getElementById("finale-gift").hidden = true;
  document.body.style.overflow = "";
  document.getElementById("book")?.focus({ preventScroll: true });
}

function resetSealUi() {
  const seal = document.getElementById("finale-seal");
  const reveal = document.getElementById("finale-reveal");
  seal.classList.remove("is-open");
  seal.hidden = false;
  reveal.hidden = true;
}

function heartPositions(count) {
  const pts = [];
  let layer = 0;
  while (pts.length < count) {
    const scale = 1.08 - layer * 0.1;
    const ringCount = Math.max(6, Math.ceil((count - pts.length) / Math.max(1, 4 - layer)));
    for (let k = 0; k < ringCount && pts.length < count; k++) {
      const t = (k / ringCount) * Math.PI * 2 + layer * 0.31;
      const x = 16 * Math.pow(Math.sin(t), 3) * scale;
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
      pts.push({
        x,
        y,
        rot: (Math.random() - 0.5) * 22,
        z: layer,
      });
    }
    layer++;
    if (layer > 14) break;
  }
  return pts.slice(0, count);
}

function buildHeartCollage() {
  const box = document.getElementById("heart-collage");
  box.innerHTML = "";
  const photos =
    HEART_PHOTOS.length > 0 ? HEART_PHOTOS : ["photos/sabina-1.png", "photos/sabina-2.png"];
  const n = 32;
  const pts = heartPositions(n);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  pts.forEach((p, i) => {
    const img = document.createElement("img");
    img.className = "heart-tile";
    img.src = photos[i % photos.length];
    img.alt = "";
    img.loading = "lazy";
    img.style.left = `${50 + (p.x / 17) * 38}%`;
    img.style.top = `${48 + (p.y / 22) * 40}%`;
    img.style.zIndex = String(5 + p.z);
    // финальная позиция/поворот задаётся CSS-переменной; старт — в CSS (scale(0.7), opacity 0)
    img.style.setProperty("--final-transform", `translate(-50%, -50%) rotate(${p.rot}deg) scale(1)`);
    box.appendChild(img);
  });

  // Появление по очереди: плитки «собирают» сердце
  const tiles = [...box.querySelectorAll(".heart-tile")];
  if (reduce) {
    tiles.forEach((t) => {
      t.style.transform = t.style.getPropertyValue("--final-transform");
      t.classList.add("is-in");
    });
    return;
  }

  const baseDelay = 45;
  tiles.forEach((t, i) => {
    const delay = i * baseDelay + Math.random() * 60;
    window.setTimeout(() => {
      t.style.transform = t.style.getPropertyValue("--final-transform");
      t.classList.add("is-in");
      if (i % 5 === 0) t.classList.add("heart-tile--glow");
    }, delay);
  });
}

function showHeartScreen() {
  document.getElementById("screen-heart").hidden = false;
  buildHeartCollage();
}

function hideHeartScreen() {
  document.getElementById("screen-heart").hidden = true;
}

function initBook() {
  const book = document.getElementById("book");
  const hint = document.getElementById("hint");
  renderSpreadBook(book);
  const pages = [...book.querySelectorAll(".page")];
  const dots = setupProgress(pages.length);
  let current = 0;
  updateProgress(dots, current);

  function refreshTop() {
    pages.forEach((p, i) => {
      p.classList.toggle("is-top", i === current && !p.classList.contains("is-turned"));
    });
  }

  function onBookComplete() {
    hint.textContent = "Открой сердце и нажми «К печати», когда будешь готова.";
    showHeartScreen();
  }

  function goNext() {
    const p = pages[current];
    if (!p || p.classList.contains("is-turned")) return;
    p.classList.add("is-turned");
    p.classList.remove("is-top");
    current++;
    updateProgress(dots, Math.min(current, pages.length - 1));
    const nextTop = pages.find((x, i) => i >= current && !x.classList.contains("is-turned"));
    if (nextTop) nextTop.classList.add("is-top");
    if (current >= pages.length) onBookComplete();
    else refreshTop();
  }

  function goPrev() {
    if (current <= 0) return;
    if (!document.getElementById("screen-heart").hidden) hideHeartScreen();
    resetSealUi();
    if (!document.getElementById("finale-gift").hidden) closeFinaleGift();
    current--;
    pages[current].classList.remove("is-turned");
    pages.forEach((x) => x.classList.remove("is-top"));
    pages[current].classList.add("is-top");
    updateProgress(dots, current);
    hint.textContent = "Нажми на книгу — следующий разворот. Кнопка ниже — назад.";
    refreshTop();
  }

  function tapBook() {
    goNext();
  }

  let lastTouch = 0;
  book.addEventListener(
    "touchend",
    (e) => {
      if (e.changedTouches.length !== 1) return;
      lastTouch = Date.now();
      e.preventDefault();
      tapBook();
    },
    { passive: false }
  );

  book.addEventListener("click", (e) => {
    if (Date.now() - lastTouch < 450) return;
    tapBook();
  });

  document.getElementById("book-back").addEventListener("click", () => goPrev());
}

function initFinaleAndHeart() {
  document.getElementById("heart-cta").addEventListener("click", () => {
    hideHeartScreen();
    openFinaleGift();
  });

  const seal = document.getElementById("finale-seal");
  const reveal = document.getElementById("finale-reveal");

  seal.addEventListener("click", () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      seal.hidden = true;
      reveal.hidden = false;
      return;
    }
    seal.classList.add("is-open");
    window.setTimeout(() => {
      seal.hidden = true;
      reveal.hidden = false;
    }, 820);
  });

  document.getElementById("finale-close").addEventListener("click", () => closeFinaleGift());
  document.getElementById("finale-backdrop").addEventListener("click", () => closeFinaleGift());
}

function initGlobalKeys() {
  window.addEventListener("keydown", (e) => {
    const fin = document.getElementById("finale-gift");
    if (!fin.hidden) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeFinaleGift();
      }
      return;
    }
    const heart = document.getElementById("screen-heart");
    if (!heart.hidden) {
      if (e.key === "Escape") {
        e.preventDefault();
        document.getElementById("book-back")?.click();
      }
      return;
    }
    const bookApp = document.getElementById("book-app");
    if (bookApp.hidden) return;
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      document.getElementById("book")?.click();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      document.getElementById("book-back")?.click();
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  document.body.style.overflow = "hidden";
  await runIntro();
  document.body.style.overflow = "";
  await runCatScene();

  document.getElementById("book-app").hidden = false;
  initBook();
  initFinaleAndHeart();
  initGlobalKeys();
});
