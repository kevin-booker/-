// ---------- 首頁按鈕 ----------
const startBtn = document.getElementById("startBtn");
if(startBtn) startBtn.addEventListener("click", () => window.location.href="game.html");

// ---------- 返回首頁 ----------
const backBtn = document.getElementById("backBtn");
if(backBtn) backBtn.addEventListener("click", () => window.location.href="index.html");

// ---------- 遊戲視角控制 ----------
const world = document.getElementById("world");
const viewport = document.getElementById("viewport");

if(world && viewport){
  world.addEventListener("dragstart", e => e.preventDefault());

  const imgWidth = 768;
  const imgHeight = 512;
  const worldWidth = imgWidth*2;
  const worldHeight = imgHeight*2;

  let isDragging = false;
  let startX=0, startY=0, moveX=0, moveY=0;
  let scale = 1;

  
  const maxScale = 3;
  const minScale = Math.max(viewport.offsetWidth/worldWidth, viewport.offsetHeight/worldHeight);

  // 初始動畫參數
  const initScale = 5;        // 一開始非常放大
  const finalScale = minScale; // 縮小到滿版
  scale = initScale;
  moveX = -(worldWidth*scale/2 - viewport.offsetWidth/2);
  moveY = -(worldHeight*scale/2 - viewport.offsetHeight/2);

  function updateTransform(){
    world.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
  }

  function limitBounds(){
    const scaledWidth = worldWidth*scale;
    const scaledHeight = worldHeight*scale;
    const minX = Math.min(0, viewport.offsetWidth - scaledWidth);
    const minY = Math.min(0, viewport.offsetHeight - scaledHeight);
    moveX = Math.min(0, Math.max(moveX, minX));
    moveY = Math.min(0, Math.max(moveY, minY));
  }

  // ---------- 開場動畫 ----------
  const animDuration = 2000;
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
  //測試互動//
    // ---------- 點擊讀取世界座標（測試用） ----------
  world.addEventListener("click", e => {
    // world 在畫面上的位置
    const rect = world.getBoundingClientRect();

    // 換算成「世界座標」
    const worldX = (e.clientX - rect.left) / scale;
    const worldY = (e.clientY - rect.top) / scale;

    console.log("世界座標：", Math.round(worldX), Math.round(worldY));
  });


  const fields = [
  {
    name: "田地1",
    polygon: [{x:449,y:627}, {x:404,y:588}, {x:248,y:692}, {x:293,y:731}],
    cropImg: "flower.jpg",
    hasCrop: false // 判斷這塊地是否已種植
  }
];

viewport.addEventListener("click", e => {
  const rect = viewport.getBoundingClientRect();
  const clickX = (e.clientX - rect.left - moveX)/scale;
  const clickY = (e.clientY - rect.top - moveY)/scale;

  for (let field of fields) {
    if(pointInPolygon({x:clickX, y:clickY}, field.polygon)) {
      showPlantBox(field, e.clientX, e.clientY);
      break; // 找到一塊地就停止
    }
  }
});

function pointInPolygon(point, vs) {
  let x = point.x, y = point.y;
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    let xi = vs[i].x, yi = vs[i].y;
    let xj = vs[j].x, yj = vs[j].y;

    let intersect = ((yi > y) != (yj > y))
                 && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if(intersect) inside = !inside;
  }
  return inside;
}

function showPlantBox(field, clientX, clientY) {
  // 先刪掉舊的方塊
  const oldBox = document.getElementById("plantBox");
  if(oldBox) oldBox.remove();

  // 建立新的方塊
  const box = document.createElement("div");
  box.id = "plantBox";
  box.style.position = "absolute";
  box.style.left = clientX + "px";
  box.style.top = clientY + "px";
  box.style.padding = "10px";
  box.style.background = "rgba(255,255,255,0.9)";
  box.style.border = "2px solid green";
  box.style.zIndex = 100;
  box.style.transform = "translate(-50%, -100%)";

  // 顯示農地名稱
  const name = document.createElement("div");
  name.textContent = field.name;
  name.style.marginBottom = "5px";
  box.appendChild(name);

  // 建立種植按鈕
  const btn = document.createElement("button");
  btn.textContent = "種植";
  btn.addEventListener("click", ()=>{
    plantCrop(field);
    box.remove();
  });
  box.appendChild(btn);

  document.body.appendChild(box);
}

function plantCrop(field) {
  if(field.hasCrop) return; // 已經種過不再種

  const img = document.createElement("img");
  img.src = field.cropImg;
  img.style.position = "absolute";
  img.style.left = "0px";
  img.style.top = "0px";
  img.style.width = worldWidth + "px";
  img.style.height = worldHeight + "px";
  img.style.pointerEvents = "none"; // 不阻擋滑鼠
  world.appendChild(img);

  field.hasCrop = true; // 標記已種植
}

}
