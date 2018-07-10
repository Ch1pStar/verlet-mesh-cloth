import {stage, getTxt} from '../misc.js';
import Cloth from '../Cloth.js';

export default class ClothDebug {

    static async create(txtStr) {
      const txt = await getTxt(txtStr)
      const c = new Cloth(txt);
      const debug = new ClothDebug(c);

      return debug;
    }

    constructor(cloth) {
        this.cloth = cloth;

        this.addControls();

        PIXI.ticker.shared.add(cloth.update);

        stage.addChildAt(cloth, 0);
    }

    addControls() {
      const cl = this.cloth;
      const pts = cl.points;
      const p = pts[pts.length - (cl.pointColumns/2)|0];

      p.pinned = true;
      document.addEventListener('mousemove', (e) => {
        p.x = e.clientX;
        p.y = e.clientY;
      });

      document.addEventListener('mouseup', (e) => {
        e.stopPropagation();
        if(e.button !== 1) return;

        p.pinned = false;

        for(let i=0,len=pointColumns;i<len;i++){
          pts[i].pinned = false;
        }
      });
    }

}