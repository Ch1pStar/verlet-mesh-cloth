import {renderer, stage} from './misc.js';
import Stick from './stick.js';
import VerletPoint from './VerletPoint.js';

let points = [];
let sticks = [];
let plane;
let txt;


const pointsWidth = 5;
const pointsHeight = 5;

const uploadVerts = () => {
  const len = plane.vertices.length;
  const verts = new Float32Array(len);

  for(let i=0;i<len;i+=2){
    const p = points[i/2];
    const x = p.x;
    const y = p.y;

    verts[i] = x;
    verts[i+1] = y;
  }

  plane.vertices = verts;
}

const updatePoints = (t) => {
  for(let i=0,len=points.length;i<len;i++){
    const p = points[i];

    p.updatePhysics(t);
  }
}

const createSticks = () => {
  let q = 0;

  for(let y=0;y<pointsHeight;y++){
    for(let x=0;x<pointsWidth;x++){
      const invert = pointsHeight-y-1; //inverts y axis

      //link upward
      if(y != 0) { //skip top row
        const p0 = points[invert*pointsWidth+x];
        const p1 = points[(invert+1)*pointsWidth+x];

        sticks[q] = new Stick({p0:p0, p1: p1, l:d(p0, p1)});
        q++;
      }

      //link leftward (is that a word?)
      if(x != 0) { //skip left edge
        const p0 = points[invert*pointsWidth+x];
        const p1 = points[invert*pointsWidth+x-1];

        sticks[q] = new Stick({p0:p0, p1: p1, l:d(p0, p1)});;
        q++;
      }
    }
  }

}

const update = (t) => {
  requestAnimationFrame(update);

  updatePoints(t);

  updateSticks(t);

  uploadVerts();
}

const init = async () => {

  // initRender();

  // txt = PIXI.Texture.fromImage('snek.png');
  txt = PIXI.Texture.fromImage('rtg-logo.svg');

  await new Promise((res) => txt.baseTexture.once('loaded', res)); 

  plane = new PIXI.mesh.Plane(txt, pointsWidth, pointsHeight);
  // plane.x = width/2 - plane.width/2;
  // plane.drawMode = renderer.gl.TRIANGLES;


  const verts = plane.vertices;
  const len = verts.length;

  points = new Array(len/2);

  for(let i=0,len=verts.length;i<len;i+=2){
    let p = new VerletPoint(verts[i], verts[i+1]);

    if(i/2 < pointsWidth) p.pinned = true;

    points[i/2] = p;
  }

  createSticks();

  document.addEventListener('mousemove', (e)=>{
    const p = points[points.length - (pointsWidth/2)|0];

    p.x = e.clientX;
    p.y = e.clientY;
  });

  document.addEventListener('mouseup', (e)=>{
    e.stopPropagation();
    if(e.button !== 2) return;

    for(let i=0,len=pointsWidth;i<len;i++){
      points[i].pinned = false;
    }
  });

  stage.addChild(plane);

  update(performance.now());
};

function updateSticks() {
  // console.time('sticks update');
  // for(let k=0;k<4;k++){
    for(let i=0,len=sticks.length;i<len;i++){
        sticks[i].update();
    }
  // }
  // console.timeEnd('sticks update');
}

function d(p0, p1){
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;

    return Math.sqrt(dx * dx + dy * dy);
}

document.addEventListener('DOMContentLoaded', init);