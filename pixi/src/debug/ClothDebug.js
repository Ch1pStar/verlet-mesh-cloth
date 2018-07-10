import {stage, getTxt} from '../misc.js';
import Cloth from '../Cloth.js';
import { GUI } from '../../../node_modules/dat.gui/build/dat.gui.module.js';

export default class ClothDebug {

    static async create(txtStr) {
      const txt = await getTxt(txtStr)
      const c = new Cloth(txt);
      const debug = new ClothDebug(c);

      c.debug = this;
      this._enableControls = false;

      return debug;
    }

    constructor(cloth) {
        this.cloth = cloth;

        // this.addControls();

        PIXI.ticker.shared.add(cloth.update);

        stage.addChildAt(cloth, 0);

        this.createDebugPanel();
    }

    createDebugPanel() {
      const gui = new GUI();
      const f = gui.addFolder('Cloth');

      f.open();
      f.add({frame: true}, 'frame').onChange((val) => this.cloth.pointsFrame.visible = val);
      f.add({wind: true}, 'wind').onChange((val) => this.cloth.hasWind = val);
      f.add({gravity: true}, 'gravity').onChange((val) => this.cloth.hasGravity = val);

      document.body.appendChild(gui.domElement)
    }

    addControls() {
      const cl = this.cloth;
      const pts = cl.points;
      const p = pts[pts.length - (cl.pointColumns/2)|0];

      p.pinned = true;
      document.addEventListener('mousemove', (e) => {
        if(!this._enableControls) return;

        p.x = e.clientX;
        p.y = e.clientY;
      });

      document.addEventListener('mouseup', (e) => {
        e.stopPropagation();
        if(e.button !== 1) return;

        p.pinned = false;

        this.unpin();
      });
    }

    unpin() {
      const cl = this.cloth;
      const pts = cl.points;

      for(let i=0,len=cl.pointColumns;i<len;i++){
        pts[i].pinned = false;
      }
    }

}
