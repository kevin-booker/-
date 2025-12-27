// ---------- 首頁按鈕 ----------
const startBtn = document.getElementById("startBtn");
if (startBtn) startBtn.addEventListener("click", () => window.location.href="game.html");

// ---------- 返回首頁 ----------
const backBtn = document.getElementById("backBtn");
if (backBtn) backBtn.addEventListener("click", () => window.location.href="index.html");

// ---------- 遊戲視角控制 ----------
const world = document.getElementById("world");
const viewport = document.getElementById("viewport");

if (world && viewport) {
  world.addEventListener("dragstart", e => e.preventDefault());

  const imgWidth = 768;
  const imgHeight = 512;
  const worldWidth = imgWidth*2;
  const worldHeight = imgHeight*2;

  let isDragging = false;
  let startX=0, startY=0, moveX=0, moveY=0;
  let scale = 1;

  const maxScale = 3;
  const minScale = Math.max(viewport.offsetWidth / worldWidth, viewport.offsetHeight / worldHeight);

  // 初始動畫參數
  const initScale = 5;  // 初始超大放大
  const finalScale = minScale; // 縮小到滿版
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
  const animDuration = 2000; // 毫秒
  let animStart = null;
  function animateOpen(timestamp){
    if(!animStart) animStart = timestamp;
    let t = (timestamp - animStart)/animDuration;
    if(t>1) t=1;

    scale = initScale - t*(initScale-finalScale);
    moveX = -(worldWidth*scale/2 - viewport.offsetWidth/2);
    moveY = -(worldHeight*scale/2 - viewport.offsetHeight/2);
    updateTransform();

    if(t<1) requestAnimationFrame(animateOpen);
  }
  requestAnimationFrame(animateOpen);

  // ---------- 拖曳 ----------
  world.addEventListener("mousedown", e=>{
    isDragging=true;
    startX = e.clientX - moveX;
    startY = e.clientY - moveY;
    world.style.cursor="grabbing";
  });
  window.addEventListener("mousemove", e=>{
    if(!isDragging) return;
    moveX = e.clientX - startX;
    moveY = e.clientY - startY;
    limitBounds();
    updateTransform();
  });
  window.addEventListener("mouseup", ()=>{
    isDragging=false;
    world.style.cursor="grab";
  });

  // ---------- 滾輪縮放 ----------
  window.addEventListener("wheel", e=>{
    e.preventDefault();
    const zoomSpeed = 0.0015;
    let newScale = Math.min(Math.max(scale - e.deltaY*zoomSpeed, minScale), maxScale);

    const rect = world.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    moveX = moveX - mx*(newScale-scale);
    moveY = moveY - my*(newScale-scale);

    scale = newScale;
    limitBounds();
    updateTransform();
  }, {passive:false});

  // 初始 transform
  updateTransform();
}
