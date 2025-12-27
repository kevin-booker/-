// ---------- 首頁按鈕 ----------
const startBtn = document.getElementById("startBtn");
if(startBtn) startBtn.addEventListener("click", () => window.location.href="game.html");

// ---------- 返回首頁按鈕 ----------
const backBtn = document.getElementById("backBtn");
if(backBtn) backBtn.addEventListener("click", () => window.location.href="index.html");

// ---------- 遊戲視角控制 ----------
const world = document.getElementById("world");
const viewport = document.getElementById("viewport");

if(world && viewport){
  world.addEventListener("dragstart", e => e.preventDefault());

  const mapW = 768;
  const mapH = 512;

  const worldWidth = mapW*2;
  const worldHeight = mapH*2;

  let isDragging = false;
  let startX=0, startY=0, moveX=0, moveY=0;
  let scale = 1;

  const minScale = Math.max(viewport.offsetWidth/worldWidth, viewport.offsetHeight/worldHeight);
  const maxScale = 5;  // 最大縮放
  const animInitScale = 5; // 開場動畫初始放大倍數

  // 初始中心
  moveX = -(worldWidth*animInitScale/2 - viewport.offsetWidth/2);
  moveY = -(worldHeight*animInitScale/2 - viewport.offsetHeight/2);
  scale = animInitScale;

  updateTransform();

  // ---------- 開場動畫 ----------
  const animDuration = 2000; // 動畫時間2秒
  let animStart = null;

  function animateOpen(timestamp){
    if(!animStart) animStart = timestamp;
    let t = (timestamp - animStart)/animDuration;
    if(t>1) t=1;

    // scale 從 animInitScale 緩慢縮小到 minScale
    scale = animInitScale - t*(animInitScale - minScale);

    moveX = -(worldWidth*scale/2 - viewport.offsetWidth/2);
    moveY = -(worldHeight*scale/2 - viewport.offsetHeight/2);

    updateTransform();

    if(t<1) requestAnimationFrame(animateOpen);
  }
  requestAnimationFrame(animateOpen);

  // ---------- 拖曳 ----------
  world.addEventListener("mousedown", e=>{
    isDragging = true;
    startX = e.clientX - moveX;
    startY = e.clientY - moveY;
    world.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", e=>{
    if(!isDragging) return;
    moveX = e.clientX - startX;
    moveY = e.clientY - startY;
    limitBounds();
    updateTransform();
  });

  window.addEventListener("mouseup", ()=>{
    isDragging = false;
    world.style.cursor = "grab";
  });

  // ---------- 滾輪縮放 ----------
  window.addEventListener("wheel", e=>{
    e.preventDefault();
    const zoomSpeed = 0.0015;
    let newScale = scale - e.deltaY*zoomSpeed;
    newScale = Math.min(Math.max(newScale, minScale), maxScale);

    // 滑鼠為中心縮放
    const rect = world.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    moveX = moveX - (mx)*(newScale - scale);
    moveY = moveY - (my)*(newScale - scale);

    scale = newScale;
    limitBounds();
    updateTransform();
  }, {passive:false});

  // ---------- 更新 transform ----------
  function updateTransform(){
    world.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
  }

  // ---------- 邊界限制 ----------
  function limitBounds(){
    const scaledW = worldWidth*scale;
    const scaledH = worldHeight*scale;

    const minX = Math.min(0, viewport.offsetWidth - scaledW);
    const minY = Math.min(0, viewport.offsetHeight - scaledH);

    moveX = Math.min(0, Math.max(moveX, minX));
    moveY = Math.min(0, Math.max(moveY, minY));
  }
}
