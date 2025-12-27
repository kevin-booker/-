/* ===== 首頁 → 遊戲 ===== */
const startBtn = document.getElementById("startBtn");
if (startBtn) {
  startBtn.onclick = () => location.href = "game.html";
}

/* ===== 遊戲 → 首頁 ===== */
const backBtn = document.getElementById("backBtn");
if (backBtn) {
  backBtn.onclick = () => location.href = "index.html";
}

/* ===== 拖曳 & 縮放 ===== */
const world = document.getElementById("world");
const viewport = document.getElementById("viewport");

if (world && viewport) {
  let dragging = false;
  let startX = 0, startY = 0;
  let x = 0, y = 0;
  let scale = 1;

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

  window.addEventListener("wheel", e => {
    e.preventDefault();
    scale -= e.deltaY * 0.001;
    scale = Math.min(Math.max(scale, 0.5), 3);
    update();
  }, { passive: false });

  function update() {
    world.style.transform =
      `translate(${x}px, ${y}px) scale(${scale})`;
  }

  update();
}
