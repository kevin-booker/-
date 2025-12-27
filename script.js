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
  world.addEventListener("dragstart", e => e.preventDefault());

  // 初始化參數
  let isDragging = false,
      startX = 0,
      startY = 0,
      moveX = 0,
      moveY = 0,
      scale = 2, // 初始放大倍數，較大視野
      minScale = 0, // 稍後計算
      maxScale = 3;

  // 計算最小縮放 scale，保證整個農場填滿視窗
  const worldWidth = 768*2;  // 兩張水平
  const worldHeight = 512*2; // 兩張垂直
  const vpWidth = viewport.offsetWidth;
  const vpHeight = viewport.offsetHeight;

  const scaleX = vpWidth / worldWidth;
  const scaleY = vpHeight / worldHeight;
  minScale = Math.max(scaleX, scaleY); // 最小縮放，不露白邊
  scale = Math.max(scale, minScale); // 初始 scale 大於最小

  // 初始視角中心到四張圖交接點
  moveX = -worldWidth/2*scale + vpWidth/2;
  moveY = -worldHeight/2*scale + vpHeight/2;

  // 拖曳事件
  world.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX - moveX;
    startY = e.clientY - moveY;
    world.style.cursor = "grabbing";
  });
  window.addEventListener("mousemove", e => {
    if (!isDragging) return;
    moveX = e.clientX - startX;
    moveY = e.clientY - startY;
    updateTransform();
  });
  window.addEventListener("mouseup", () => {
    isDragging = false;
    world.style.cursor = "grab";
  });

  // 滾輪縮放
  window.addEventListener("wheel", e => {
    e.preventDefault();
    const zoomSpeed = 0.0015;
    scale -= e.deltaY * zoomSpeed;
    scale = Math.min(Math.max(scale, minScale), maxScale); 
    // 調整 moveX, moveY 邊界
    updateTransform();
  }, { passive: false });

  // 更新 transform 與邊界限制
  function updateTransform() {
    const vpW = viewport.offsetWidth;
    const vpH = viewport.offsetHeight;
    const wW = worldWidth*scale;
    const wH = worldHeight*scale;

    const minX = Math.min(0, vpW - wW);
    const minY = Math.min(0, vpH - wH);
    moveX = Math.min(0, Math.max(moveX, minX));
    moveY = Math.min(0, Math.max(moveY, minY));

    world.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
  }

  // ---------- 開場動畫 ----------
  let animating = true;
  const targetScale = minScale; // 目標縮小到完整農場
  function animateOpening() {
    if (!animating) return;
    // 每次縮小一點
    const diff = (scale - targetScale) * 0.05; 
    if (Math.abs(scale - targetScale) < 0.001) {
      scale = targetScale;
      animating = false; // 停止動畫
    } else {
      scale -= diff;
      // 調整中心位置
      moveX = -worldWidth/2*scale + vpWidth/2;
      moveY = -worldHeight/2*scale + vpHeight/2;
    }
    updateTransform();
    if (animating) requestAnimationFrame(animateOpening);
  }
  animateOpening(); // 啟動開場動畫
}
