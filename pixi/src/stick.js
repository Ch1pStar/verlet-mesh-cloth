import { ELASTICITY } from './config.js';

export default class Stick {

    constructor(data) {
        this.p0 = data.p0;
        this.p1 = data.p1;
        this.length = data.l;
        // this._elasticityCoefficient = (ELASTICITY*Math.random())+1 | 0;
        this._elasticityCoefficient = ELASTICITY || 1.5;
    }

    update() {
      // console.time('stick update');
      let p0 = this.p0;
      let p1 = this.p1;

      let dx = p0.x - p1.x;
      let dy = p0.y - p1.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      let difference = this.length - distance;
      let percent = difference / distance / this._elasticityCoefficient;

      let offsetX = dx * percent;
      let offsetY = dy * percent;

      // p0._x += offsetX;
      // p0._y += offsetY;

      // p1._x -= offsetX;
      // p1._y -= offsetY;

      if(!p0.pinned) {
        p0.x += offsetX;
        p0.y += offsetY;
      }
     
      if(!p1.pinned) {
        p1.x -= offsetX;
        p1.y -= offsetY;
      }

      // console.timeEnd('stick update');
    }
}
