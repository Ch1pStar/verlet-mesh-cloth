import {width, height, gravity, friction, bounce} from './config.js';

export default class VerletPoint extends PIXI.Point{

    constructor(x, y, pinned = false) {
        super(x,y);

        this._prevX = x;
        this._prevY = y;

        this.pinned = pinned;

    }

    constraint(vx, vy) {
        if(this.x > width) {
            this.x = width;
            this._prevX = this.x + vx * bounce;
        }
        else if(this.x < 0) {
            this.x = 0;
            this._prevX = this.x + vx * bounce;
        }

        if(this.y > height) {
            this.y = height;
            this._prevY = this.y + vy * bounce;
        }
        else if(this.y < 0) {
            this.y = 0;
            this._prevY = this.y + vy * bounce;
        }
    }

    updatePhysics(t, log) {
        if(this.pinned){
            // console.error('nope');
            return;
        }
        
        const vx = (this.x - this._prevX) * friction;
        const vy = (this.y - this._prevY) * friction;

        log && console.log(vy, this.y, this._prevY);
        // debugger;

        this._prevX = this.x;
        this._prevY = this.y;

        this.x += vx;
        this.y += vy + gravity;

        this.constraint(vx, vy);
    }

}