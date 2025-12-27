/* ======================
   按鈕
====================== */
const startBtn = document.getElementById("startBtn");
if (startBtn) startBtn.onclick = () => location.href = "game.html";

const backBtn = document.getElementById("backBtn");
if (backBtn) backBtn.onclick = () => location.href = "index.html";

/* ======================
   地圖拖曳 & 縮放
====================== */
const world = document.getElementById("world");
const viewport = document.getElementById("viewport");

if (world && viewport) {

  /* ---------- 狀態 ---------- */
  let dragging = false;
  let startX = 0, startY = 0;
  let x = 0, y = 0;
  let scale = 1;
  let minScale = 1;   // ⭐ 關鍵：最小縮放

  /* ---------- 計算世界原始尺寸 ---------- */
  function getWorldSize() {
    return {
      width: world.offsetWidth,
      height: world.offsetHeight
    };
  }

  /* ---------- 計算最小縮放（一定滿版） ---------- */
  function calculateMinScale() {
    const worldSize = getWorldSize();
    const scaleX = viewport.clientWidth / worldSize.width;
    const scaleY = viewport.clientHeight / worldSize.height;
    minScale = Math.max(scaleX, scaleY); // ⭐ 保證不露白
  }

  /* ---------- 邊界限制 ---------- */
  function clampPosition() {
    const worldW = world.offsetWidth * scale;
    const worldH = world.offsetHeight * scale;

    const minX = viewport.clientWidth - worldW;
    const minY = viewport.clientHeight - worldH;

    x = Math.min(0, Math.max(x, minX));
    y = Math.min(0, Math.max(y, minY));
  }

  /* ---------- 套用 transform ---------- */
  function update() {
    clampPosition();
    world.style.transform =
      `translate(${x}px, ${y}px) scale(${scale})`;
  }

  /* ---------- 拖曳 ---------- */
  world.onmousedown = e => {
    dragging = true;
    startX = e.clientX - x;
    startY = e.clientY - y;
    world.style.cursor = "grabbing";
  };

  window.onmousemove = e => {
    if (!dragging) return;
    x = e.clientX - startX;
    y = e.clientY - startY;
    update();
  };

  window.onmouseup = () => {
    dragging = false;
    world.style.cursor = "grab";
  };

  /* ---------- 縮放（限制不露白） ---------- */
  window.addEventListener("wheel", e => {
    e.preventDefault();

    scale -= e.deltaY * 0.001;
    scale = Math.max(minScale, Math.min(scale, 3));

    update();
  }, { passive: false });

  /* ======================
     初始視角 & 動畫
  ====================== */

  function startAnimation() {
    world.style.transition = "transform 1.2s ease";

    // 🔧 你之後可以改這裡，決定一開始看哪
    scale = minScale * 1.2;
    x = -200;
    y = -150;

    update();

    // 動畫結束後解除 transition（避免拖拉延遲）
    setTimeout(() => {
      world.style.transition = "none";
    }, 1300);
  }

  /* ---------- 初始化 ---------- */
  calculateMinScale();
  scale = minScale;   // ⭐ 一開始一定滿版
  x = (viewport.clientWidth - world.offsetWidth * scale) / 2;
  y = (viewport.clientHeight - world.offsetHeight * scale) / 2;

  update();
  startAnimation();
}
