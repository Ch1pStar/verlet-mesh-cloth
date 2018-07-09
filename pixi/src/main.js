let width = window.innerWidth;
let height = window.innerHeight;
let renderer = PIXI.autoDetectRenderer({
// let renderer = new PIXI.CanvasRenderer({
    width, height,
    backgroundColor: 0,
    clearBeforeRender: false,
    antialias: true
  }), view, stage = new PIXI.Container();
let points = [];
let sticks = [];

let gravity = 0;
let friction = .9999;
// let friction = 1;
let bounce = .9;
const pointsData = [
  {
    x:100,
    y:50,
  },
  {
    x:150,
    y:50,
  },
  {
    x:150,
    y:100,
  },
  {
    x:100,
    y:100,
  },
  {
    x:20,
    y:20,
    pinned: true,
  },
];

let stickData;

const init = () => {

  initRender();

  initPoints();
  initSticks();

  document.addEventListener('mousemove', (e)=>{
    points[4].x = e.clientX;
    points[4].y = e.clientY;
  });

  const update = (t) => {
    requestAnimationFrame(update);

    for(let i=0,len=points.length;i<len;i++){
        points[i].update();
    }

    for(let i=0,len=sticks.length;i<len;i++){
      for(let k=0;k<100;k++){
        sticks[i].update();
      }
    }

    renderer.render(stage);
  }

  update(performance.now());
};

const initPoints = () => {
  for(let i=0,len=pointsData.length;i<len;i++){
    const point = new Point(pointsData[i]);

    point.sprite && stage.addChild(point.sprite);
    points.push(point);
  }
};

const initSticks = () => {

    stickData = [
      {
        p0: points[0],
        p1: points[1],
        length: distance(points[0], points[1]),
      },
      {
        p0: points[1],
        p1: points[2],
        length: distance(points[1], points[2]),
      },
      {
        p0: points[2],
        p1: points[3],
        length: distance(points[2], points[3]),
      },
      {
        p0: points[3],
        p1: points[0],
        length: distance(points[3], points[0]),
      },
      // {
      //   p0: points[0],
      //   p1: points[2],
      //   length: distance(points[0], points[2]),
      // },
      {
        p0: points[4],
        p1: points[0],
        length: distance(points[4], points[0]),
      },
    ];

    for(let i=0,len=stickData.length;i<len;i++){
      const stick = new Stick(stickData[i]);

      stick.sprite && stage.addChild(stick.sprite);
      sticks.push(stick);
    }

};

const initRender = () => {
  view = renderer.view;
  document.body.appendChild(view);
};

const distance = (p0, p1) => {
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;

    return Math.sqrt(dx * dx + dy * dy);
}

document.addEventListener('DOMContentLoaded', init);