// ====================
// 首頁：開始遊戲
// ====================
const startBtn = document.getElementById("startBtn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    window.location.href = "game.html";
  });
}

// ====================
// 遊戲頁：返回首頁
// ====================
const backBtn = document.getElementById("backBtn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// ====================
// 遊戲頁：視角控制（只在 world 存在時）
// ====================
const world = document.querySelector(".world");
world.addEventListener("dragstart", (e) => e.preventDefault());
if (world) {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let moveX = 0;
  let moveY = 0;
  let scale = 1;

  // 滑鼠按下
  world.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX - moveX;
    startY = e.clientY - moveY;
    world.style.cursor = "grabbing";
  });

  // 滑鼠移動
  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    moveX = e.clientX - startX;
    moveY = e.clientY - startY;
    updateTransform();
  });

  // 滑鼠放開
  window.addEventListener("mouseup", () => {
    isDragging = false;
    world.style.cursor = "grab";
  });

  // 滾輪縮放
  world.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomSpeed = 0.001;
    scale -= e.deltaY * zoomSpeed;
    scale = Math.min(Math.max(scale, 0.5), 3);
    updateTransform();
  });

  function updateTransform() {
    world.style.transform =
      `translate(${moveX}px, ${moveY}px) scale(${scale})`;
  }
}
