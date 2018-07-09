
function d(p0, p1){
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;

    return Math.sqrt(dx * dx + dy * dy);
}

class Cloth {

  constructor() {
    this.points = [];
    this.sticks = [];
    this.plane;
    this.txt;

    this.pointsWidth = 50;
    this.pointsHeight = 20;
  }


  update(t) {
    this.updatePoints(t);

    this.updateSticks(t);

    this.uploadVerts();
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
    const points = this.points;

    for(let i=0,len=points.length;i<len;i++){
      const p = points[i];

      p.updatePhysics(t);
    }
  }

  updateSticks() {
    const sticks = this.sticks;

    for(let k=0;k<8;k++){
      for(let i=0,len=sticks.length;i<len;i++){
          sticks[i].update();
      }
    }
  }

  createSticks() {
    const pointsWidth = this.pointsWidth;
    const pointsHeight = this.pointsHeight;
    const points = this.points;
    const sticks = this.sticks;
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


}