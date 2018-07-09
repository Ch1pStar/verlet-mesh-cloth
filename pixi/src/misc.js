import {width, height} from './config.js';

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
