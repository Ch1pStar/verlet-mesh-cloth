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

document.addEventListener('DOMContentLoaded', () => {
  const view = renderer.view;
  const draw = () => renderer.render(stage);

  document.body.appendChild(view);

  window.r = renderer;
  window.v = view;
  window.POINTS = pointsWidth * pointsHeight;

  // always draw
  PIXI.ticker.shared.add(draw);
});

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
