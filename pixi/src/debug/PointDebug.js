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
      this._exitEdit();
      this.on('click', this.toggleEdit);

      this.anchor.set(0.5);
      this.updatePosition();

      point.debug = this;
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
    }

    _exitEdit() {
      this._editMode = false;
      this.on('mouseover', this._activate);
      this.on('mouseout', this._deactivate);
    }

    _activate() {
        const activeScale = 90 / this.cloth.pointColumns

        this.scale.set(activeScale);
        this.alpha = 0.6;
        this.tint = 0xAA1199;
    }

    _deactivate() {
      const inactiveScale = 30 / this.cloth.pointColumns;

      this.scale.set(inactiveScale);
      this.alpha = 1;
      this.tint = 0xffffff;
    }

}
