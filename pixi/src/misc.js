import {width, height, pointsWidth, pointsHeight} from './config.js';

export const stage = new PIXI.Container()

export const renderer = PIXI.autoDetectRenderer({
// let renderer = new PIXI.CanvasRenderer({
    width, height,
    // backgroundColor: 0xCCCCCC,
    backgroundColor: 0,
    clearBeforeRender: true,
    antialias: false
});

// always draw
function draw() {
  requestAnimationFrame(draw);

  renderer.render(stage);
}

document.addEventListener('DOMContentLoaded', () => {
  const view = renderer.view;
  document.body.appendChild(view);

  window.r = renderer;
  window.v = view;

  requestAnimationFrame(draw);
});

export function addControls(points) {
  const p = points[points.length - (pointsWidth/2)|0];

  p.pinned = true;

  document.addEventListener('mousemove', (e) => {
    p.x = e.clientX;
    p.y = e.clientY;
  });

  document.addEventListener('mouseup', (e) => {
    e.stopPropagation();
    if(e.button !== 1) return;

    p.pinned = false;

    for(let i=0,len=pointsWidth;i<len;i++){
      points[i].pinned = false;
    }
  });
}

export function dist(p0, p1){
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;

    return Math.sqrt(dx * dx + dy * dy);
}

export async function getTxt(path = 'snek.png') {
  const txt = PIXI.Texture.fromImage(path);

  await new Promise((res) => txt.baseTexture.once('loaded', res)); 

  return txt;
}
