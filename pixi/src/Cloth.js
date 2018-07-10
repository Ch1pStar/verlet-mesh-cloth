import {stage, dist, getTxt} from './misc.js';
import Stick from './stick.js';
import VerletPoint from './VerletPoint.js';
import {pointsWidth, pointsHeight, NUM_STEPS, ENABLE_DEBUG} from './config.js';

const Plane = PIXI.mesh.Plane;
const Container = PIXI.particles.ParticleContainer;
const Sprite = PIXI.Sprite;
const Texture = PIXI.Texture;

export default class Cloth{

  constructor(texture = Texture.WHITE){
    this.points = [];
    this.sticks = [];
    this.plane = null;
    this.texture = texture;

    this.update = this._update.bind(this);

    this.initPlane();
  }

  async initPlane() {
    if(!this.texture.baseTexture.hasLoaded) throw new Error('Cannot create Cloth with textures that are not yet loaded');

    this.plane = new PIXI.mesh.Plane(this.texture, pointsWidth, pointsHeight);

    this.createPoints();

    this.createSticks();

    this.update(performance.now());

    stage.addChildAt(this.plane, 0);
  }

  uploadVerts() {
    const len = this.plane.vertices.length;
    const verts = new Float32Array(len);

    for(let i=0;i<len;i+=2){
      const p = this.points[i/2];
      const x = p.x;
      const y = p.y;

      verts[i] = x;
      verts[i+1] = y;
    }

    this.plane.vertices = verts;
  }

  updatePoints(t) {
    const pts = this.points;

    for(let i=0,len=pts.length;i<len;i++){
      const p = pts[i];
      const debug = p.debug;

      p.updatePhysics(t);

      debug.x = p.x;
      debug.y = p.y;
    }
  }

  createSticks() {
    let q = 0;
    const pts = this.points;
    const sticks = this.sticks;

    for(let y=0;y<pointsHeight;y++){
      for(let x=0;x<pointsWidth;x++){
        const invert = pointsHeight-y-1; //inverts y axis

        //link upward
        if(y != 0) { //skip top row
          const p0 = pts[invert*pointsWidth+x];
          const p1 = pts[(invert+1)*pointsWidth+x];

          sticks[q] = new Stick({p0:p0, p1: p1, l:dist(p0, p1)});
          q++;
        }

        //link leftward (is that a word?)
        if(x != 0) { //skip left edge
          const p0 = pts[invert*pointsWidth+x];
          const p1 = pts[invert*pointsWidth+x-1];

          sticks[q] = new Stick({p0:p0, p1: p1, l:dist(p0, p1)});;
          q++;
        }
      }
    }
  }


  createPoints() {
    const verts = this.plane.vertices;
    const len = verts.length;

    this.points = new Array(len/2);

    const pointsDebug = new Container();

    stage.addChild(pointsDebug);

    for(let i=0,len=verts.length;i<len;i+=2){
      let p = new VerletPoint(verts[i], verts[i+1]);

      if(i/2 < pointsWidth) p.pinned = true;

      this.points[i/2] = p;

      pointsDebug.addChild(this.createPointDebug(p));
    }
  }

  createPointDebug(point) {
    const debugPoint = new PIXI.Sprite(PIXI.Texture.WHITE);

    debugPoint.scale.set(0.2);
    debugPoint.anchor.set(0.5);
    debugPoint.position.set(point.x, point.y);

    point.debug = debugPoint;

    return debugPoint;
  }

  updateSticks() {
    // console.time('sticks update');
    for(let k=0;k<NUM_STEPS;k++){
      for(let i=0,len=this.sticks.length;i<len;i++){
          this.sticks[i].update();
      }
    }
    // console.timeEnd('sticks update');
  }

  _update(t) {
    requestAnimationFrame(this.update);

    this.updatePoints(t);

    this.updateSticks(t);

    this.uploadVerts();
  }

}
