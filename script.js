// ---------- 返回首頁 ----------
const backBtn = document.getElementById("backBtn");
if (backBtn) backBtn.addEventListener("click", () => window.location.href="index.html");

// ---------- 遊戲視角控制 ----------
const world = document.getElementById("world");
const viewport = document.getElementById("viewport");

if (world && viewport) {
  // 防止圖片被誤拖走
  world.addEventListener("dragstart", e => e.preventDefault());

  // --- 四張圖總尺寸 ---
  const worldWidth = 768 * 2;  // 寬度兩張圖
  const worldHeight = 512 * 2; // 高度兩張圖

  // --- 參數 ---
  let moveX = 0, moveY = 0, scale = 1;
  let isDragging = false;

  const maxScale = 3; // 可自行調整最大縮放
  const minScale = Math.max(viewport.offsetWidth/worldWidth, viewport.offsetHeight/worldHeight); 
  const initScale = 6;  // 開場動畫初始非常放大
  const animDuration = 2000; // 開場動畫時間 ms

  // --- 初始位置：四張圖中心對齊 viewport 中心 ---
  scale = initScale;
  moveX = -(worldWidth*scale/2 - viewport.offsetWidth/2);
  moveY = -(worldHeight*scale/2 - viewport.offsetHeight/2);

  updateTransform();

  // ---------- 初始開場動畫 ----------
  let animStart = null;
  function animateOpen(timestamp){
    if(!animStart) animStart = timestamp;
    let t = (timestamp - animStart)/animDuration;
    if(t > 1) t = 1;

    // 線性縮小 scale
    scale = initScale - t*(initScale - minScale);

    // 保持四張圖中心在 viewport 中心
    moveX = -(worldWidth*scale/2 - viewport.offsetWidth/2);
    moveY = -(worldHeight*scale/2 - viewport.offsetHeight/2);

    updateTransform();

    if(t < 1){
      requestAnimationFrame(animateOpen);
    } else {
      // 動畫結束後才啟用拖拉和縮放
      enableInteraction();
    }
  }
  requestAnimationFrame(animateOpen);

  // ---------- 拖拉與縮放邏輯 ----------
  function enableInteraction(){
    // 拖曳開始
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
      let newScale = scale - e.deltaY * zoomSpeed;
      newScale = Math.min(Math.max(newScale, minScale), maxScale);

      // 滑鼠位置為中心縮放
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

  // ---------- 更新 transform ----------
  function updateTransform(){
    world.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
  }

  // ---------- 限制邊界，不露黑邊 ----------
  function limitBounds(){
    const scaledWidth = worldWidth*scale;
    const scaledHeight = worldHeight*scale;

    const minX = Math.min(0, viewport.offsetWidth - scaledWidth);
    const minY = Math.min(0, viewport.offsetHeight - scaledHeight);

    moveX = Math.min(0, Math.max(moveX, minX));
    moveY = Math.min(0, Math.max(moveY, minY));
  }
}
