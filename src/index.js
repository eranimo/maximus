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
const VIEWPORT_WIDTH = window.innerWidth;
const VIEWPORT_HEIGHT = window.innerHeight;
const ZOOM_MIN = 0.2;
const ZOOM_MAX = 2.0;
const ZOOM_INTERVAL = 0.005;
const MINIMAP_WIDTH = 200;
const MINIMAP_HEIGHT = 200;


window.onload = () => {
  // $FlowFixMe
  const mainCanvas: HTMLElement = document.getElementById('gameCanvas');
  // $FlowFixMe
  const minimapCanvas: HTMLElement = document.getElementById('minimapCanvas');
  if (!mainCanvas || !minimapCanvas) {
    throw new Error('Fuck flowtype');
  }
  mainCanvas.setAttribute('width', `${VIEWPORT_WIDTH}px`);
  mainCanvas.setAttribute('height', `${VIEWPORT_HEIGHT}px`);

  minimapCanvas.setAttribute('width', `${MINIMAP_WIDTH}px`);
  minimapCanvas.setAttribute('height', `${MINIMAP_HEIGHT}px`);

  const world: World = new World({
    main: mainCanvas,
    minimap: minimapCanvas,
  });
  world.loop();
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
  viewportTopLeft: Coordinate;
  viewportBottomRight: Coordinate;

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
    window.addEventListener('resize', this.handleResize.bind(this));
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

    this.onMovement();
  }

  handleResize() {
    console.log('resize');
    this.viewportSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.canvas.setAttribute('width', `${this.viewportSize.width}px`);
    this.canvas.setAttribute('height', `${this.viewportSize.height}px`);
  }

  onMovement() {
    this.viewportTopLeft = this.viewportToWorld({
      x: 0,
      y: 0,
    });

    this.viewportBottomRight = this.viewportToWorld({
      x: this.viewportSize.width,
      y: this.viewportSize.height
    });
  }

  tick() {
    this.checkKeysPressed();
  }

  isKeyPressed(keyCode: number): boolean {
    return this.keysPressed[keyCode] === true;
  }

  handleKeyup(event) {
    if (event.keyCode === 32) {
      this.changeZoomLevel(1, this.cursorLocation.x, this.cursorLocation.y);
    } else if (event.keyCode === 13) {
      this.travel({
        x: SCENE_WIDTH / 2,
        y: SCENE_WIDTH / 2,
      }, 100);
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
      x: this.toZoom((this.viewportSize.width / 2) - this.offset.x),
      y: this.toZoom((this.viewportSize.height / 2) - this.offset.y),
    };
  }

  handleZoom(event) {
    const direction = event.deltaY < 0 ? 'up' : 'down';
    const mag: number = Math.abs(event.deltaY);
    event.preventDefault();
    const { offsetX: x, offsetY: y } = event;
    if (direction === 'down') {
      this.changeZoomLevel(this.zoomLevel + (mag * ZOOM_INTERVAL), x, y);
    } else {
      this.changeZoomLevel(this.zoomLevel - (mag * ZOOM_INTERVAL), x, y);
    }
  }

  changeZoomLevel(zoomLevel, x = this.center.x, y = this.center.y) {
    zoomLevel = _.clamp(zoomLevel, ZOOM_MIN, ZOOM_MAX);
    const lastZoomLevel = this.zoomLevel;
    this.zoomLevel = zoomLevel;
    this.move(
      x / this.zoomLevel - x / lastZoomLevel,
      y / this.zoomLevel - y / lastZoomLevel,
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
    this.onMovement();
  }

  jump(coord: Coordinate) {
    this.offset = {
      x: -coord.x + this.fromZoom(this.viewportSize.width / 2),
      y: -coord.y + this.fromZoom(this.viewportSize.height / 2),
    };
    console.log('Jump to:', this.offset);
    this.onMovement();
  }

  travel({ x, y }: Coordinate, duration: number = 1000){
    console.log(`Travel to ${x}, ${y} from ${this.center.x}, ${this.center.y}`);
    const current: Object = this.center;
    const jump = this.jump.bind(this);
    anime({
      targets: current,
      x,
      y,
      duration,
      round: 1,
      easing: 'linear',
      update() {
        jump(current);
      }
    })
  }

  panUp() {
    this.isPanning = false;
    this.panLocation = null;
    this.canvas.style.cursor = 'pointer';
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
      this.offset.x += this.fromZoom(diff.x);
      this.offset.y += this.fromZoom(diff.y);
      if (this.panLocation == null) {
        return;
      }
      this.panLocation.x += diff.x;
      this.panLocation.y += diff.y;

      this.onMovement();
    }

    this.cursorLocation = {
      x: event.offsetX,
      y: event.offsetY,
    };
  }

  toZoom(number: number): number {
    return number * this.zoomLevel;
  }

  fromZoom(number: number): number {
    return number / this.zoomLevel;
  }

  worldToViewport(coord: Coordinate): Coordinate {
    return {
      x: this.toZoom(this.offset.x + coord.x),
      y: this.toZoom(this.offset.y + coord.y),
    };
  }

  // convert viewport coordinates to world coordinates
  viewportToWorld(coord: Coordinate): Coordinate {
    return {
      x: -this.fromZoom(this.offset.x) + coord.x,
      y: -this.fromZoom(this.offset.y) + coord.y,
    };
  }

  getViewportRealSize(): Size {
    return {
      width: this.viewportSize.width / this.zoomLevel,
      height: this.viewportSize.height / this.zoomLevel,
    };
  }
}

class Region {
  board: Board;
  ctx: CanvasRenderingContext2D;

  constructor(board: Board, ctx: CanvasRenderingContext2D) {
    this.board = board;
    this.ctx = ctx;

    let cells = _.random(500);
    for (let i = 0; i < cells; i++) {
      const x = _.random(0, SCENE_CELLS_WIDTH - 1);
      const y = _.random(0, SCENE_CELLS_HEIGHT - 1);
      this.board[x][y] = { color: 'blue' };
    }
  }

  draw(viewport: Viewport) {
    const ctx = this.ctx;
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
            viewport.toZoom(CELL_SIZE),
            viewport.toZoom(CELL_SIZE)
          );
        }
      }
    }
  }
}

class Minimap {
  ctx: CanvasRenderingContext2D;
  viewport: Viewport;
  board: Board;

  constructor(ctx: CanvasRenderingContext2D, viewport: Viewport, board: Board) {
    this.ctx = ctx;
    this.viewport = viewport;
    this.board = board;
  }

  draw() {
    const ctx = this.ctx;
    const { viewportSize, sceneSize, viewportTopLeft, viewportBottomRight } = this.viewport;
    const toZoom = this.viewport.toZoom.bind(this.viewport);
    const fromZoom = this.viewport.fromZoom.bind(this.viewport);

    const minimapOrigin = {
      x: 0.5 + viewportSize.width - MINIMAP_WIDTH,
      y: 0.5 + viewportSize.height - MINIMAP_HEIGHT,
    };

    // minimap background
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.rect(
      0,
      0,
      MINIMAP_WIDTH,
      MINIMAP_HEIGHT,
    );
    ctx.fill();

    // minimap board
    for (let x = 0; x < SCENE_CELLS_WIDTH; x++) {
      for (let y = 0; y < SCENE_CELLS_HEIGHT; y++) {
        const cell = this.board[x][y];
        if (cell) {
          ctx.beginPath();
          ctx.fillStyle = cell.color;
          ctx.fillRect(
            1 + MINIMAP_WIDTH * 2 * (x / MINIMAP_WIDTH),
            1 + MINIMAP_HEIGHT * 2 * (y / MINIMAP_HEIGHT),
            1,
            1,
          );
          ctx.fill();
        }
      }
    }

    // minimap frame
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    const { width, height } = this.viewport.getViewportRealSize();
    ctx.rect(
      0.5 + Math.round((-this.viewport.offset.x / sceneSize.width) * MINIMAP_WIDTH),
      0.5 + Math.round((-this.viewport.offset.y / sceneSize.height) * MINIMAP_HEIGHT),
      Math.round(MINIMAP_WIDTH * (width / sceneSize.width)),
      Math.round(MINIMAP_HEIGHT * (height / sceneSize.height)),
    );
    ctx.stroke();
  }
}

class World {
  canvas: HTMLElement;
  ctx: CanvasRenderingContext2D;
  minimapCanvas: HTMLElement;
  minimapCtx: CanvasRenderingContext2D;

  viewport: Viewport;
  region: Region;
  minimap: Minimap;

  constructor({ minimap, main }: { minimap: HTMLElement, main: HTMLElement }) {
    this.canvas = main;
    this.minimapCanvas = minimap;

    // $FlowFixMe
    const mainContext: CanvasRenderingContext2D = main.getContext('2d');
    mainContext.imageSmoothingEnabled = false;
    mainContext.translate(0.5, 0.5)
    // $FlowFixMe
    const minimapContext: CanvasRenderingContext2D = minimap.getContext('2d');
    minimapContext.imageSmoothingEnabled = false;
    minimapContext.translate(0.5, 0.5)

    this.ctx = mainContext;
    this.minimapCtx = minimapContext;


    this.viewport = new Viewport({
      width: SCENE_WIDTH,
      height: SCENE_HEIGHT
    }, {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
    }, this.canvas);
    window.viewport = this.viewport;
    const board: Board = makeBoard();
    this.region = new Region(board, mainContext);
    this.minimap = new Minimap(minimapContext, this.viewport, board);
  }

  draw() {
    this.ctx.fillStyle = 'white';
    const { width, height } = this.viewport.viewportSize;
    this.ctx.fillRect(0, 0, width, height);
    this.region.draw(this.viewport);

    this.minimap.draw();
  }

  update() {
    this.viewport.tick();
  }

  loop() {
    this.update();
    this.draw();

    requestAnimationFrame(() => {
      this.loop();
    });
  }
}
