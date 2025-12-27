// ---------- 首頁按鈕 ----------
const startBtn = document.getElementById("startBtn");
if (startBtn) startBtn.addEventListener("click", () => window.location.href="game.html");

// ---------- 返回首頁按鈕 ----------
const backBtn = document.getElementById("backBtn");
if (backBtn) backBtn.addEventListener("click", () => window.location.href="index.html");

// ---------- 遊戲視角控制 ----------
const world = document.getElementById("world");
const viewport = document.getElementById("viewport");

if (world && viewport) {
  // 防止圖片被誤拖走
  world.addEventListener("dragstart", e => e.preventDefault());

  // 初始化參數
  let isDragging = false,
      startX = 0,
      startY = 0,
      moveX = 0,
      moveY = 0,
      scale = 1;

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

 function updateTransform() {
  // 先套用 transform（讓瀏覽器算實際尺寸）
  world.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;

  // 取得 viewport 與 world 的實際顯示尺寸
  const vpRect = viewport.getBoundingClientRect();
  const worldRect = world.getBoundingClientRect();

  // 計算邊界（world 比 viewport 大才限制）
  const minX = vpRect.width - worldRect.width;
  const minY = vpRect.height - worldRect.height;

  // 限制拖曳範圍，避免露白
  moveX = Math.min(0, Math.max(moveX, minX));
  moveY = Math.min(0, Math.max(moveY, minY));

  // 再套一次，確保修正後位置生效
  world.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
}

  // 初始視角
  updateTransform();
}
