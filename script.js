const world = document.getElementById("world");
const viewport = document.getElementById("viewport");

if (world && viewport) {

  /* ---------- 等所有圖片載入 ---------- */
  const images = world.querySelectorAll("img");
  let loaded = 0;

  images.forEach(img => {
    if (img.complete) {
      loaded++;
    } else {
      img.onload = () => {
        loaded++;
        if (loaded === images.length) init();
      };
    }
  });

  if (loaded === images.length) init();

  /* ======================
     真正初始化（關鍵）
  ====================== */
  function init() {

    let x = 0, y = 0;
    let scale = 1;
    let minScale = 1;
    let dragging = false;
    let startX = 0, startY = 0;

    /* ---------- 計算最小縮放（滿版） ---------- */
    function calcMinScale() {
      const worldW = world.offsetWidth;
      const worldH = world.offsetHeight;

      const scaleX = viewport.clientWidth / worldW;
      const scaleY = viewport.clientHeight / worldH;

      minScale = Math.max(scaleX, scaleY);
      scale = minScale;
    }

    /* ---------- 邊界限制 ---------- */
    function clamp() {
      const w = world.offsetWidth * scale;
      const h = world.offsetHeight * scale;

      const minX = viewport.clientWidth - w;
      const minY = viewport.clientHeight - h;

      x = Math.min(0, Math.max(x, minX));
      y = Math.min(0, Math.max(y, minY));
    }

    /* ---------- 更新 ---------- */
    function update() {
      clamp();
      world.style.transform =
        `translate(${x}px, ${y}px) scale(${scale})`;
    }

    /* ---------- 初始化位置（置中） ---------- */
    calcMinScale();
    x = (viewport.clientWidth - world.offsetWidth * scale) / 2;
    y = (viewport.clientHeight - world.offsetHeight * scale) / 2;
    update();

    /* ---------- 開場動畫 ---------- */
    world.style.transition = "transform 1.2s ease";
    scale = minScale * 1.2;
    x -= 200;
    y -= 150;
    update();

    setTimeout(() => {
      world.style.transition = "none";
    }, 1300);

    /* ---------- 拖曳 ---------- */
    world.onmousedown = e => {
      dragging = true;
      startX = e.clientX - x;
      startY = e.clientY - y;
      world.style.cursor = "grabbing";
    };

    window.onmousemove = e => {
      if (!dragging) return;
      x = e.clientX - startX;
      y = e.clientY - startY;
      update();
    };

    window.onmouseup = () => {
      dragging = false;
      world.style.cursor = "grab";
    };

    /* ---------- 縮放（不露白） ---------- */
    window.addEventListener("wheel", e => {
      e.preventDefault();
      scale -= e.deltaY * 0.001;
      scale = Math.max(minScale, Math.min(scale, 3));
      update();
    }, { passive: false });
  }
}
