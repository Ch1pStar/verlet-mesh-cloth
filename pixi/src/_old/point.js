const genPointTexture = (radius) => {
  const width = radius*5;
  const height = radius*5;
  const rt = PIXI.RenderTexture.create(width, height);
  const pt = new PIXI.Graphics();

  pt.lineStyle(1);
  pt.beginFill(0xFFFFFF, 1);
  pt.drawCircle(radius, radius, radius);
  pt.endFill();
  renderer.render(pt, rt);

  return rt;
}
let pTexture;
document.addEventListener('DOMContentLoaded', ()=>{
    pTexture = genPointTexture(5)
});

class Point{

    constructor(data) {
        this.sprite = new PIXI.Sprite(pTexture);
        // this.sprite.anchor.set(0.5);

        this._x = data.x+Math.random()*5;
        this._y = data.y;

        this.x = data.x;
        this.y = data.y;

        this.pinned = data.pinned;
    }

    update(){
        if(this.pinned){
            console.error('nope');
            return;
        }
        
        const vx = (this._x - this._oldX) * friction;
        const vy = (this._y - this._oldY) * friction;

        this.x += vx;
        this.y += vy + gravity;

        this.constraint(vx, vy);
    }

    constraint(vx, vy) {
        if(this.x > width) {
            this._x = width;
            this._oldX = this._x + vx * bounce;
        }
        else if(this.x < 0) {
            this._x = 0;
            this._oldX = this._x + vx * bounce;
        }
        if(this.y > height-15) {
            this._y = height-15;
            this._oldY = this._y + vy * bounce;
        }
        else if(this.y < 0) {
            this._y = 0;
            this._oldY = this._y + vy * bounce;
        }
    }

    set x(val) {
        this._oldX = this._x;
        this._x = val;
        this.sprite && (this.sprite.x = val);
    }

    set y(val) {
        this._oldY = this._y;
        this._y = val;
        this.sprite && (this.sprite.y = val);
    }

    get x() {return this._x};
    get y() {return this._y};

    get oldX() {return this._oldX};
    get oldY() {return this._oldY};

}