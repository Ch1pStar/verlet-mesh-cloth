import { GUI } from '../../../node_modules/dat.gui/build/dat.gui.module.js';

export default class PointDebug extends PIXI.Sprite {

  /**
   * TODO
   *
   * ADD DAT GUI TO EDIT ACTIVE POINT PROPERTIES
   *   - GRAVITY
   *   - WIND
   *   - FRICTION
   *   - BOUNCE
   *   - ELASTICITY
   */
    constructor(point, cloth) {
      super(PIXI.Texture.WHITE);

      this.cloth = cloth;
      this.point = point;

      this.interactive = true;
      this._deactivate();
      this.on('mouseover', this._activate);
      this.on('mouseout', this._deactivate);
      this.on('click', this.toggleEdit);

      this.anchor.set(0.5);
      this.updatePosition();

      this._createDebugPanel();

      point.debug = this;
    }

    _createDebugPanel() {
      const gui = new GUI();

      // TODO Better controls
      gui.add(this.point, 'pinned');
      gui.add(this.point, 'bounce');
      gui.add(this.point, 'friction');

      // doesnt work, since Cloth sets these values on every update
      gui.add(this.point, 'gravity');
      gui.add(this.point, 'wind');

      gui.domElement.style.display = 'none';
      this.debugPanel = gui;
      document.body.appendChild(gui.domElement)
    }

    set active(val) {
      val ? this._activate() : this._deactivate();
    }

    toggleEdit() {
      this.editMode = !this.editMode;
    }

    set editMode(val) {
      val ? this._edit() : this._exitEdit();
    }

    get editMode() {
      return this._editMode;
    }

    update() {
      this.updatePosition();
    }

    updatePosition() {
      this.position.set(this.point.x, this.point.y);
    }

    _edit() {
      this._editMode = true;
      this.off('mouseover', this._activate);
      this.off('mouseout', this._deactivate);

      this.debugPanel.domElement.style.display = 'block';
      this.debugPanel.open();
    }

    _exitEdit() {
      this._editMode = false;
      this.on('mouseover', this._activate);
      this.on('mouseout', this._deactivate);

      this.debugPanel.close();
      this.debugPanel.domElement.style.display = 'none';
    }

    _activate() {
        const activeScale = Math.max(90 / this.cloth.pointColumns, 2);

        this.scale.set(activeScale);
        this.alpha = 0.6;
        this.tint = 0xAA1199;
    }

    _deactivate() {
      const inactiveScale = Math.max(30 / this.cloth.pointColumns, 0.5);

      this.scale.set(inactiveScale);
      this.alpha = 1;
      this.tint = 0xffffff;
    }

}
