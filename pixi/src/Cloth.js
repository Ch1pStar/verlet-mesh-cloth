import {stage, dist, getTxt} from './misc.js';
import Stick from './Stick.js';
import VerletPoint from './VerletPoint.js';
import {pointsWidth, pointsHeight, NUM_STEPS, gravity} from './config.js';

const Plane = PIXI.mesh.Plane;
const Container = PIXI.particles.ParticleContainer;
const Sprite = PIXI.Sprite;
const Texture = PIXI.Texture;

export default class Cloth extends Plane{

  constructor(texture = Texture.WHITE, pointColumns = pointsWidth, pointRows = pointsHeight){
    super(texture, pointColumns, pointRows);

    this.points = [];
    this.sticks = [];
    this.pointColumns = pointColumns;
    this.pointRows = pointRows;
    this._updateSteps = NUM_STEPS;
    this.update = this._update.bind(this);

    this.hasWind = true;
    this.hasGravity = true;

    this.createPoints();

    this.createSticks();
  }

  uploadVerts() {
    const len = this.vertices.length;
    const verts = new Float32Array(len);

    for(let i=0;i<len;i+=2){
      const p = this.points[i/2];
      const x = p.x;
      const y = p.y;

      verts[i] = x;
      verts[i+1] = y;
    }

    this.vertices = verts;
  }

  updatePoints(t) {
    const pts = this.points;
    const currentTime = performance.now();
    const wind = this.hasWind ? Math.sin(currentTime*0.001)*0.1 : 0;
    const g = this.hasGravity ? gravity : 0;

    for(let i=0,len=pts.length;i<len;i++){
      const p = pts[i];

      p.wind = wind;
      p.gravity = g;
      p.updatePhysics(t);
    }
  }

  createSticks() {
    let q = 0;
    const pts = this.points;
    const sticks = this.sticks;
    const rows = this.pointRows;
    const cols = this.pointColumns;

    for(let y=0;y<rows;y++){
      for(let x=0;x<cols;x++){
        const invert = rows-y-1; //inverts y axis

        //link upward
        if(y != 0) { //skip top row
          const p0 = pts[invert*cols+x];
          const p1 = pts[(invert+1)*cols+x];

          sticks[q] = new Stick({p0:p0, p1: p1, l:dist(p0, p1)});
          q++;
        }

        //link leftward (is that a word?)
        if(x != 0) { //skip left edge
          const p0 = pts[invert*cols+x];
          const p1 = pts[invert*cols+x-1];

          sticks[q] = new Stick({p0:p0, p1: p1, l:dist(p0, p1)});;
          q++;
        }
      }
    }
  }

  createPoints() {
    const verts = this.vertices;
    const len = verts.length;
    const topRowPinLeft = (this.pointColumns * 0.3)|0;
    const topRowPinRight = (this.pointColumns * 0.7)|0;

    this.points = new Array(len/2);

    for(let i=0,len=verts.length;i<len;i+=2){
      let p = new VerletPoint(verts[i], verts[i+1]);
      const pPos = i/2;

      if((pPos<topRowPinLeft || pPos>topRowPinRight) && pPos < this.pointColumns) p.pinned = true;

      this.points[pPos] = p;
    }
  }

  updateSticks() {
    // console.time('sticks update');
    for(let k=0;k<this._updateSteps;k++){
      for(let i=0,len=this.sticks.length;i<len;i++){
          this.sticks[i].update();
      }
    }
    // console.timeEnd('sticks update');
  }

  _update(t) {
    this.updatePoints(t);

    this.updateSticks(t);

    this.uploadVerts();
  }

}
