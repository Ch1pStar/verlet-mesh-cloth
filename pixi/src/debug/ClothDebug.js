import {stage, getTxt} from '../misc.js';
import Cloth from '../Cloth.js';
import PointDebug from './PointDebug.js';
import { GUI } from '../../../node_modules/dat.gui/build/dat.gui.module.js';


// const Container = PIXI.particles.ParticleContainer;
const Container = PIXI.Container;
const ticker = PIXI.ticker.shared;

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
        this._isRunning = true;

        // this.addControls();

        ticker.add(cloth.update);
        ticker.add(this._debugUpdate.bind(this));

        stage.addChildAt(cloth, 0);

        this._createPointsDebug();
        this._createDebugPanel();
    }

    _createPointsDebug() {
      const pointsDebug = new Container();
      const pts = this.cloth.points;

      for(let i=0;i<pts.length;i++){
        const pt = pts[i];
        const sp = new PointDebug(pt, this.cloth);

        pointsDebug.addChild(sp);
      }

      this.pointsFrame = pointsDebug;
      stage.addChild(pointsDebug);
    }

    _createDebugPanel() {
      const gui = new GUI();
      const f = gui.addFolder('Cloth');

      f.open();
      f.add(this, 'running');
      f.add(this.pointsFrame, 'visible');
      f.add(this.cloth, 'hasWind');
      f.add(this.cloth, 'hasGravity');

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

    get running() {
      return this._isRunning;
    }

    set running(val) {
      this._isRunning = val;
      this._isRunning ? ticker.add(this.cloth.update) : ticker.remove(this.cloth.update)
    }

    _debugUpdate() {
      const pts = this.cloth.points;

      for(let i=0,len=pts.length;i<len;i++) pts[i].debug.update();
    }
}
