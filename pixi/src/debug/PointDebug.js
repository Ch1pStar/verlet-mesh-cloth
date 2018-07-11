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

      this._deactivate();
      this.anchor.set(0.5);
      this.position.set(point.x, point.y);

      this.interactive = true;
      this.on('mouseover', this._activate);

      this.on('mouseout', this._deactivate);

      point.debug = this;
    }

    set active(val) {
      val ? this._activate() : this._deactivate();
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
