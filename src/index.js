// @flow
import anime from 'animejs';
import './style.css';
import _ from 'lodash';


type Cell = {
  color: string
}

type Coordinate = {
  x: number,
  y: number
};

type Size = {
  width: number,
  height: number
};

const SCENE_CELLS_WIDTH = 100;
const SCENE_CELLS_HEIGHT = 100;
const CELL_SIZE = 25;
const SCENE_WIDTH = SCENE_CELLS_WIDTH * CELL_SIZE;
const SCENE_HEIGHT = SCENE_CELLS_HEIGHT * CELL_SIZE;
const VIEWPORT_WIDTH = 590;
const VIEWPORT_HEIGHT = 590;
const ZOOM_MIN = 0.2;
const ZOOM_MAX = 2.0;
const ZOOM_INTERVAL = 0.05;


let canvas: HTMLElement;
let ctx: CanvasRenderingContext2D;
window.onload = () => {
  // $FlowFixMe
  canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    throw new Error('Fuck flowtype');
  }
  canvas.setAttribute('width', `${VIEWPORT_WIDTH}px`);
  canvas.setAttribute('height', `${VIEWPORT_HEIGHT}px`);
  // $FlowFixMe
  ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.translate(0.5, 0.5)
  const world: World = new World(canvas, ctx);
  world.loop();
  console.log(ctx);
}

type Board = Array<Array<any>>;
function makeBoard(): Board {
  return _.times(SCENE_CELLS_WIDTH, () => _.times(SCENE_CELLS_HEIGHT, () => null));
}


class Viewport {
  isPanning: boolean;
  sceneSize: Size;
  viewportSize: Size;
  panLocation: ?Coordinate;
  offset: Coordinate;
  cursorLocation: Coordinate;
  zoomLevel: number;
  canvas: HTMLElement;
  keysPressed: Object;

  constructor(sceneSize: Size, viewportSize: Size, canvas: HTMLElement) {
    this.sceneSize = sceneSize;
    this.viewportSize = viewportSize;
    this.panLocation = null;
    this.canvas = canvas;
    this.zoomLevel = 1;
    this.offset = { x: 0, y: 0 };
    this.cursorLocation = { x: 0, y: 0 };
    this.keysPressed = {};

    this.canvas.style.cursor = 'pointer';
    this.canvas.addEventListener('mouseup', this.panUp.bind(this));
    this.canvas.addEventListener('mousedown', this.panDown.bind(this));
    this.canvas.addEventListener('mousemove', this.panMove.bind(this));
    this.canvas.addEventListener('mouseout', this.panUp.bind(this));
    // $FlowFixMe
    this.canvas.addEventListener('wheel', this.handleZoom.bind(this));
    // $FlowFixMe
    document.addEventListener('keyup', event => {
      this.keysPressed[event.keyCode] = false;
      this.handleKeyup(event);
    });
    // $FlowFixMe
    document.addEventListener('keydown', event => {
      this.keysPressed[event.keyCode] = true;
    });
  }

  update() {
    this.checkKeysPressed();
  }

  isKeyPressed(keyCode: number): boolean {
    return this.keysPressed[keyCode] === true;
  }

  handleKeyup(event) {
    if (event.keyCode === 32) {
      this.changeZoomLevel(1, this.cursorLocation.x, this.cursorLocation.y);
    }
  }

  checkKeysPressed(): boolean {
    const delta = 15;
    let didSomething: boolean = false;
    if (this.isKeyPressed(38) || this.isKeyPressed(87)) { // up
      this.move(0, delta);
      didSomething = true;
    }
    if (this.isKeyPressed(40) || this.isKeyPressed(83)) { // down
      this.move(0, -delta);
      didSomething = true;
    }
    if (this.isKeyPressed(37) || this.isKeyPressed(65)) { // left
      this.move(delta, 0);
      didSomething = true;
    }
    if (this.isKeyPressed(39) || this.isKeyPressed(68)) { // right
      this.move(-delta, 0);
      didSomething = true;
    }
    return didSomething;
  }

  // the world coordinate at the center of the screen
  get center(): Coordinate {
    return {
      x: ((this.viewportSize.width / 2) - this.offset.x) * this.zoomLevel,
      y: ((this.viewportSize.height / 2) - this.offset.y) * this.zoomLevel,
    };
  }

  handleZoom(event) {
    const direction = event.deltaY < 0 ? 'up' : 'down';
    console.log(direction);
    event.preventDefault();
    const { offsetX: x, offsetY: y } = event;
    if (direction === 'down') {
      this.changeZoomLevel(this.zoomLevel + ZOOM_INTERVAL, x, y);
    } else {
      this.changeZoomLevel(this.zoomLevel - ZOOM_INTERVAL, x, y);
    }
  }

  changeZoomLevel(zoomLevel, x = this.center.x, y = this.center.y) {
    zoomLevel = _.clamp(zoomLevel, ZOOM_MIN, ZOOM_MAX);
    const lastZoomLevel = this.zoomLevel;
    this.zoomLevel = zoomLevel;
    this.move(
      x * this.zoomLevel - x * lastZoomLevel,
      y * this.zoomLevel - y * lastZoomLevel,
    );
  }


  resetZoom() {
    const lastZoomLevel = this.zoomLevel;
    const { x, y } = this.cursorLocation;
    this.zoomLevel = 1;
    this.move(
      x * this.zoomLevel - x * lastZoomLevel,
      y * this.zoomLevel - y * lastZoomLevel,
    );
  }

  move(x: number, y: number) {
    this.offset.x += x;
    this.offset.y += y;
  }

  jump(x: number, y: number) {
    this.offset = {
      x: -x + (this.viewportSize.width / 2) * this.zoomLevel,
      y: -y + (this.viewportSize.height / 2) * this.zoomLevel,
    };
  }

  travel({ x, y }: Coordinate){
    console.log(`Travel to ${x}, ${y} from ${this.center.x}, ${this.center.y}`);
    const current: Object = {
      ...this.center,
      z: this.zoomLevel,
    };
    const jump = this.jump.bind(this);
    const changeZoomLevel = this.changeZoomLevel.bind(this);
    anime({
      targets: current,
      x,
      y,
      z: 1,
      round: 1,
      easing: 'linear',
      update() {
        jump(current.x, current.y);
        changeZoomLevel(current.z);
      }
    })
  }

  panDown(event: Object) {
    this.isPanning = true;
    this.panLocation = { x: event.offsetX, y: event.offsetY };
    this.canvas.style.cursor = 'move';
  }

  panMove(event: Object) {
    if (this.isPanning && this.panLocation) {
      const diff = {
        x: (this.panLocation.x - event.offsetX) / -1,
        y: (this.panLocation.y - event.offsetY) / -1,
      }
      this.offset.x += diff.x * this.zoomLevel;
      this.offset.y += diff.y * this.zoomLevel;
      this.panLocation.x += diff.x;
      this.panLocation.y += diff.y;
    }

    this.cursorLocation = {
      x: event.offsetX,
      y: event.offsetY,
    };
  }

  panUp() {
    this.isPanning = false;
    this.panLocation = null;
    this.canvas.style.cursor = 'pointer';
  }

  calculateZoom(number: number): number {
    return number / this.zoomLevel;
  }

  worldToViewport(coord: Coordinate): Coordinate {
    return {
      x: this.calculateZoom(this.offset.x + coord.x),
      y: this.calculateZoom(this.offset.y + coord.y),
    };
  }

  // convert viewport coordinates to world coordinates
  viewportToWorld(coord: Coordinate): Coordinate {
    return {
      x: this.calculateZoom(this.offset.x + coord.x),
      y: this.calculateZoom(this.offset.y + coord.y),
    };
  }
}

class Region {
  board: Board;

  constructor(board: Board) {
    this.board = board;

    let cells = _.random(500);
    for (let i = 0; i < cells; i++) {
      const x = _.random(0, SCENE_CELLS_WIDTH - 1);
      const y = _.random(0, SCENE_CELLS_HEIGHT - 1);
      this.board[x][y] = { color: 'blue' };
    }
  }

  draw(viewport: Viewport) {

    // grid
    for (let x = 0; x <= this.board.length; x++) {
      ctx.beginPath();
      ctx.strokeStyle = 'gray';
      ctx.lineWidth = 1;
      const lineFrom: Coordinate = viewport.worldToViewport({ x: x * CELL_SIZE, y: 0 });
      ctx.moveTo(lineFrom.x, lineFrom.y);
      const lineTo: Coordinate = viewport.worldToViewport({
        x: x * CELL_SIZE,
        y: SCENE_CELLS_WIDTH * CELL_SIZE,
      });
      ctx.lineTo(lineTo.x, lineTo.y);
      ctx.stroke();
    }

    for (let y = 0; y <= this.board.length; y++) {
      ctx.beginPath();
      ctx.strokeStyle = 'gray';
      ctx.lineWidth = 1;
      const lineFrom: Coordinate = viewport.worldToViewport({ x: 0, y: y * CELL_SIZE });
      ctx.moveTo(lineFrom.x, lineFrom.y);
      const lineTo: Coordinate = viewport.worldToViewport({
        x: SCENE_CELLS_WIDTH * CELL_SIZE,
        y: y * CELL_SIZE
      });
      ctx.lineTo(lineTo.x, lineTo.y);
      ctx.stroke();
    }

    // cells
    for (let x = 0; x < SCENE_CELLS_WIDTH; x++) {
      for (let y = 0; y < SCENE_CELLS_HEIGHT; y++) {
        const cell = this.board[x][y];
        if (cell) {
          ctx.fillStyle = cell.color;
          const rect: Coordinate = viewport.worldToViewport({
            x: x * CELL_SIZE,
            y: y * CELL_SIZE
          });
          ctx.fillRect(
            rect.x,
            rect.y,
            viewport.calculateZoom(CELL_SIZE),
            viewport.calculateZoom(CELL_SIZE)
          );
        }
      }
    }

    this.drawGuides(viewport);
  }

  drawGuides(viewport) {
    // // draw center of screen dot
    // if (viewport.panLocation != null && viewport.panLocation.x !== 0 && viewport.panLocation.y !== 0) {
    //   ctx.beginPath();
    //   ctx.fillStyle = 'blue';
    //   const location = viewport.panLocation;
    //   if (!location) {
    //     return;
    //   }
    //   const { x, y } = location;
    //   ctx.arc(x, y, 20, 0, 2 * Math.PI);
    //   ctx.stroke();
    // }
  }
}

class World {
  canvas: HTMLElement;
  ctx: CanvasRenderingContext2D;
  viewport: Viewport;
  region: Region;

  constructor(canvas: HTMLElement, ctx: CanvasRenderingContext2D) {
    this.viewport = new Viewport({
      width: SCENE_WIDTH,
      height: SCENE_HEIGHT
    }, {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
    }, canvas);
    window.viewport = this.viewport;
    this.canvas = canvas;
    this.ctx = ctx;
    this.region = new Region(makeBoard(), this.viewport);
  }

  draw() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    this.region.draw(this.viewport);
  }

  update() {
    this.viewport.update();
  }

  loop() {
    this.update();
    this.draw();

    requestAnimationFrame(() => {
      this.loop();
    });
  }
}
