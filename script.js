// 首頁按鈕
const startBtn = document.getElementById("startBtn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    window.location.href = "game.html";
  });
}

// 遊戲頁返回按鈕
const backBtn = document.getElementById("backBtn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// 遊戲視角控制
const world = document.querySelector(".world");
if (world) {
  world.addEventListener("dragstart", e => e.preventDefault()); // 防止預設拖動

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let moveX = 0;
  let moveY = 0;
  let scale = 1;

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

  world.addEventListener("wheel", e => {
    e.preventDefault();
    const zoomSpeed = 0.001;
    scale -= e.deltaY * zoomSpeed;
    scale = Math.min(Math.max(scale, 0.5), 3);
    updateTransform();
  });

  function updateTransform() {
    world.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
  }
}
