// ---------- 首頁按鈕 ----------
const startBtn = document.getElementById("startBtn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    window.location.href = "game.html";
  });
}

// ---------- 遊戲頁返回按鈕 ----------
const backBtn = document.getElementById("backBtn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// ---------- 遊戲視角控制 ----------
const world = document.getElementById("world");
const viewport = document.getElementById("viewport");

if (world && viewport) {
  // 防止圖片被拖走
  world.addEventListener("dragstart", e => e.preventDefault());

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let moveX = 0;
  let moveY = 0;
  let scale = 1;

  // 拖曳開始
  world.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX - moveX;
    startY = e.clientY - moveY;
    world.style.cursor = "grabbing";
  });

  // 拖曳移動
  window.addEventListener("mousemove", e => {
    if (!isDragging) return;
    moveX = e.clientX - startX;
    moveY = e.clientY - startY;
    updateTransform();
  });

  // 拖曳結束
  window.addEventListener("mouseup", () => {
    isDragging = false;
    world.style.cursor = "grab";
  });

  // 滾輪縮放
  window.addEventListener("wheel", e => {
    e.preventDefault();
    const zoomSpeed = 0.001;
    scale -= e.deltaY * zoomSpeed;
    scale = Math.min(Math.max(scale, 0.5), 3); // 限制縮放比例
    updateTransform();
  }, { passive: false });

  // 更新 transform 並限制邊界
  function updateTransform() {
    const worldWidth = 2000 * scale;   // 兩張圖寬度總和 * scale
    const worldHeight = 2000 * scale;  // 兩張圖高度總和 * scale
    const vpWidth = viewport.offsetWidth;
    const vpHeight = viewport.offsetHeight;

    // 限制邊界
    const minX = vpWidth - worldWidth;
    const minY = vpHeight - worldHeight;
    moveX = Math.min(0, Math.max(moveX, minX));
    moveY = Math.min(0, Math.max(moveY, minY));

    world.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
  }

  // 初始視角
  updateTransform();
}
