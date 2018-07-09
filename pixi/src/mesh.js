import {renderer, stage, addControls, dist, getTxt} from './misc.js';
import Stick from './stick.js';
import VerletPoint from './VerletPoint.js';
import {pointsWidth, pointsHeight, NUM_STEPS} from './config.js';

let points = [];
let sticks = [];
let plane;
let txt;

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

        sticks[q] = new Stick({p0:p0, p1: p1, l:dist(p0, p1)});
        q++;
      }

      //link leftward (is that a word?)
      if(x != 0) { //skip left edge
        const p0 = points[invert*pointsWidth+x];
        const p1 = points[invert*pointsWidth+x-1];

        sticks[q] = new Stick({p0:p0, p1: p1, l:dist(p0, p1)});;
        q++;
      }
    }
  }
}

const createPoints = () => {
  const verts = plane.vertices;
  const len = verts.length;

  points = new Array(len/2);

  for(let i=0,len=verts.length;i<len;i+=2){
    let p = new VerletPoint(verts[i], verts[i+1]);

    if(i/2 < pointsWidth) p.pinned = true;

    points[i/2] = p;
  }
};

const update = (t) => {
  requestAnimationFrame(update);

  updatePoints(t);

  updateSticks(t);

  uploadVerts();
}

const init = async () => {
  // mesh requires loaded textures, so await
  plane = new PIXI.mesh.Plane(await getTxt('rtg-logo.svg'), pointsWidth, pointsHeight);
  // plane.drawMode = renderer.gl.TRIANGLES;

  createPoints();

  createSticks();

  addControls(points);

  stage.addChild(plane);

  update(performance.now());
};

function updateSticks() {
  // console.time('sticks update');
  for(let k=0;k<NUM_STEPS;k++){
    for(let i=0,len=sticks.length;i<len;i++){
        sticks[i].update();
    }
  }
  // console.timeEnd('sticks update');
}

document.addEventListener('DOMContentLoaded', init);