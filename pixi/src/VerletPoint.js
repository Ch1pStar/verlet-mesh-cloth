import {width, height, gravity, wind, friction, bounce} from './config.js';

export default class VerletPoint extends PIXI.Point{

    constructor(x, y, pinned = false) {
        super(x,y);

        this._prevX = x;
        this._prevY = y;

        this.gravity = gravity;
        this.wind = wind;
        this.bounce = bounce;
        this.friction = friction;

        this.pinned = pinned;

    }

    constraint(vx, vy) {
        if(this.x > width) {
            this.x = width;
            this._prevX = this.x + vx * this.bounce;
        }
        else if(this.x < 0) {
            this.x = 0;
            this._prevX = this.x + vx * this.bounce;
        }

        if(this.y > height) {
            this.y = height;
            this._prevY = this.y + vy * this.bounce;
        }
        else if(this.y < 0) {
            this.y = 0;
            this._prevY = this.y + vy * this.bounce;
        }
    }

    updatePhysics(t, log = false) {
        if(this.pinned) return;
        
        const vx = (this.x - this._prevX) * this.friction;
        const vy = (this.y - this._prevY) * this.friction;

        log && console.log(vy, this.y, this._prevY);
        // debugger;

        this._prevX = this.x;
        this._prevY = this.y;

        this.x += vx + this.wind;
        this.y += vy + this.gravity;

        this.constraint(vx, vy);
    }

}
