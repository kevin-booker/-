const backBtn = document.getElementById("backBtn");
if (backBtn) {
  backBtn.addEventListener("click", () => window.location.href="index.html");
}

const world = document.getElementById("world");
const viewport = document.getElementById("viewport");

if (world && viewport) {
  world.addEventListener("dragstart", e => e.preventDefault());

  const tileWidth = 768;
  const tileHeight = 512;
  const worldWidth = tileWidth * 2;
  const worldHeight = tileHeight * 2;

  let isDragging = false,
      startX = 0,
      startY = 0,
      moveX = 0,
      moveY = 0,
      scale = 1;

  const minScale = Math.max(viewport.offsetWidth/worldWidth, viewport.offsetHeight/worldHeight);
  const maxScale = 5; // 可調整最大放大比例

  // 初始開場動畫參數
  const initScale = 5;   // 一開始非常放大
  scale = initScale;

  moveX = -(worldWidth*scale/2 - viewport.offsetWidth/2);
  moveY = -(worldHeight*scale/2 - viewport.offsetHeight/2);

  function updateTransform() {
    world.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
  }

  function limitBounds() {
    const scaledWidth = worldWidth*scale;
    const scaledHeight = worldHeight*scale;
    const minX = Math.min(0, viewport.offsetWidth - scaledWidth);
    const minY = Math.min(0, viewport.offsetHeight - scaledHeight);
    moveX = Math.min(0, Math.max(moveX, minX));
    moveY = Math.min(0, Math.max(moveY, minY));
  }

  // ---------- 開場動畫 ----------
  const animDuration = 2000; // 動畫時間
  const targetScale = minScale;
  let animStart = null;

  function animateOpen(timestamp) {
    if (!animStart) animStart = timestamp;
    let t = (timestamp - animStart) / animDuration;
    if (t > 1) t = 1;
    // 緩慢縮放
    scale = initScale - t*(initScale - targetScale);
    moveX = -(worldWidth*scale/2 - viewport.offsetWidth/2);
    moveY = -(worldHeight*scale/2 - viewport.offsetHeight/2);
    updateTransform();
    if (t < 1) {
      requestAnimationFrame(animateOpen);
    }
  }

  requestAnimationFrame(animateOpen);

  // ---------- 拖曳 ----------
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
    limitBounds();
    updateTransform();
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    world.style.cursor = "grab";
  });

  // ---------- 滾輪縮放 ----------
  window.addEventListener("wheel", e => {
    e.preventDefault();
    const zoomSpeed = 0.002;
    let newScale = Math.min(Math.max(scale - e.deltaY*zoomSpeed, minScale), maxScale);
    const rect = world.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    moveX = moveX - mx*(newScale - scale);
    moveY = moveY - my*(newScale - scale);
    scale = newScale;
    limitBounds();
    updateTransform();
  }, {passive:false});
}
