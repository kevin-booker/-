// ---------- 返回首頁 ----------
const backBtn = document.getElementById("backBtn");
if (backBtn) backBtn.addEventListener("click", () => window.location.href="index.html");

// ---------- 遊戲視角控制 ----------
const world = document.getElementById("world");
const viewport = document.getElementById("viewport");

if (world && viewport) {
  // 防止圖片被誤拖走
  world.addEventListener("dragstart", e => e.preventDefault());

  // 四張圖總尺寸
  const worldWidth = 768*2;
  const worldHeight = 512*2;

  // 初始參數
  let isDragging = false,
      startX = 0,
      startY = 0,
      moveX = 0,
      moveY = 0,
      scale = 1;

  // 最小縮放比例：保證滿版不露黑邊
  const minScale = Math.max(viewport.offsetWidth / worldWidth, viewport.offsetHeight / worldHeight);
  const maxScale = 3; // 可自行調整最大縮放

  // 初始位置：四張圖中心對齊 viewport 中心
  let initScale = 5; // 開場動畫初始縮放
  scale = initScale;

  moveX = -worldWidth/2*scale + viewport.offsetWidth/2;
  moveY = -worldHeight/2*scale + viewport.offsetHeight/2;

  updateTransform();

  // 開場動畫：從 initScale 縮小到 minScale
  const animDuration = 1500; // 毫秒
  const animStart = performance.now();
  function animateOpen(timestamp){
    let t = (timestamp - animStart) / animDuration;
    if(t>1) t=1;

    scale = initScale - t*(initScale - minScale);

    // 保持中心不動
    moveX = -worldWidth/2*scale + viewport.offsetWidth/2;
    moveY = -worldHeight/2*scale + viewport.offsetHeight/2;

    limitBounds();
    updateTransform();

    if(t<1){
      requestAnimationFrame(animateOpen);
    }
  }
  requestAnimationFrame(animateOpen);

  // 拖曳事件
  world.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX - moveX;
    startY = e.clientY - moveY;
    world.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", e => {
    if(!isDragging) return;
    moveX = e.clientX - startX;
    moveY = e.clientY - startY;
    limitBounds();
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
    const newScale = Math.min(Math.max(scale - e.deltaY*zoomSpeed, minScale), maxScale);

    // 計算鼠標為中心的縮放
    const rect = world.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    moveX = moveX - (mx)*(newScale - scale);
    moveY = moveY - (my)*(newScale - scale);

    scale = newScale;
    limitBounds();
    updateTransform();
  }, {passive:false});

  // 更新 transform
  function updateTransform(){
    world.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
  }

  // 限制邊界，不露黑邊
  function limitBounds(){
    const scaledWidth = worldWidth*scale;
    const scaledHeight = worldHeight*scale;

    const minX = Math.min(0, viewport.offsetWidth - scaledWidth);
    const minY = Math.min(0, viewport.offsetHeight - scaledHeight);

    moveX = Math.min(0, Math.max(moveX, minX));
    moveY = Math.min(0, Math.max(moveY, minY));
  }
}
