// @flow
import Point from './point';
import Intersection from './intersection';
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

const SCENE_CELLS_WIDTH = 1000;
const SCENE_CELLS_HEIGHT = 1000;
const CELL_SIZE = 20;
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

function cleanBoard(board: Board): Board {
  for (let x = 0; x < SCENE_CELLS_WIDTH; x++) {
    for (let y = 0; y < SCENE_CELLS_HEIGHT; y++) {
      board[x][y] = null;
    }
  }
  return board;
}

function randomizeBoard(board: Board): Board {
  let cells = _.random(5000, 6000);
  for (let i = 0; i < cells; i++) {
    const x = _.random(0, SCENE_CELLS_WIDTH - 1);
    const y = _.random(0, SCENE_CELLS_HEIGHT - 1);
    board[x][y] = { color: 'blue' };
  }

  return board;
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
  topLeft: Coordinate;
  bottomRight: Coordinate;

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
    this.topLeft = this.viewportToWorld({
      x: 0,
      y: 0,
    });

    this.bottomRight = this.viewportToWorld({
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
    const delta = this.fromZoom(15);
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
      x: this.fromZoom(coord.x) - this.offset.x,
      y: this.fromZoom(coord.y) - this.offset.y,
    };
  }

  // is viewport coordinate in viewport
  isInViewport(coord: Coordinate): boolean {
    const { width, height } = this.viewportSize;
    return coord.x >= 0 && coord.y >= 0 &&
           coord.x <= width && coord.y <= height;
  }

  // TODO: make this work
  clampViewport(coord: Coordinate): Coordinate {
    return {
      x: _.clamp(coord.x, 0, this.viewportSize.width),
      y: _.clamp(coord.y, 0, this.viewportSize.height),
    };
  }

  getViewportRealSize(): Size {
    return {
      width: this.viewportSize.width / this.zoomLevel,
      height: this.viewportSize.height / this.zoomLevel,
    };
  }

  // returns boolean if a viewport point is in the viewport
  isWorldPointVisible(point: Point) {
    point = this.viewportToWorld(point);
    return this.topLeft.x >= point.x && point.x <= this.bottomRight.x ||
           this.topLeft.y >= point.y && point.y <= this.bottomRight.y;
  }
}

class Region {
  world: World;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLElement;
  viewport: Viewport;
  boardRect: Object;

  constructor(world: World, canvas: HTMLElement, viewport: Viewport) {
    this.world = world;
    this.canvas = canvas;
    this.viewport = viewport;

    // $FlowFixMe
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.translate(0.5, 0.5)

  }

  get boardRect() {
    return {
      topLeft: new Point(this.viewport.topLeft.x, this.viewport.topLeft.y),
      bottomRight: new Point(this.viewport.bottomRight.x, this.viewport.bottomRight.y),
    };
  }

  draw() {
    const ctx = this.ctx;
    const viewport = this.viewport;

    this.ctx.fillStyle = 'white';
    const { width, height } = this.viewport.viewportSize;
    this.ctx.fillRect(0, 0, width, height);


    // grid
    for (let x = 0; x <= this.world.board.length; x++) {
      let pointFrom: Point = new Point(x * CELL_SIZE, 0);
      let pointTo: Point = new Point(
        x * CELL_SIZE,
        SCENE_CELLS_WIDTH * CELL_SIZE,
      );

      const intersect = this.calculateLine(
        pointFrom,
        pointTo,
      );
      if (intersect) {
        this.drawGridLine(intersect.from, intersect.to);
      }
    }

    for (let y = 0; y <= this.world.board.length; y++) {
      let pointFrom: Point = new Point(0, y * CELL_SIZE);
      let pointTo: Point = new Point(
        SCENE_CELLS_WIDTH * CELL_SIZE,
        y * CELL_SIZE
      );

      const intersect = this.calculateLine(
        pointFrom,
        pointTo,
      );
      if (intersect) {
        this.drawGridLine(intersect.from, intersect.to);
      }
    }

    // cells
    this.drawCells();

    const cursor = viewport.cursorLocation;
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText(`Cursor: (${cursor.x}, ${cursor.y})`, 0, 20);
    const cursorWorld = viewport.viewportToWorld(viewport.cursorLocation);
    ctx.fillText(`World: (${cursorWorld.x}, ${cursorWorld.y})`, 0, 2 * 20);
    ctx.fillText(`Top Left: (${viewport.topLeft.x}, ${viewport.topLeft.y})`, 0, 3 * 20);
    ctx.fillText(`Bottom Right: (${viewport.bottomRight.x}, ${viewport.bottomRight.y})`, 0, 4 * 20);
  }

  drawCells() {
    for (let x = 0; x < SCENE_CELLS_WIDTH; x++) {
      for (let y = 0; y < SCENE_CELLS_HEIGHT; y++) {
        const cell = this.world.board[x][y];
        if (cell) {
          this.ctx.fillStyle = cell.color;

          const intersect = this.calculateRect(
            new Point(x * CELL_SIZE, y * CELL_SIZE),
            CELL_SIZE,
            CELL_SIZE,
          );
          if (intersect) {
            this.ctx.fillRect(
              intersect.topLeft.x,
              intersect.topLeft.y,
              intersect.width,
              intersect.height,
            );
          }
        }
      }
    }
  }

  // calculate a rectangle in world coordinates
  // will return the top left and bottom right points in the viewport
  calculateRect(loc: Point, width: number, height: number): ?Object {
    const loc2 = new Point(loc.x + width, loc.y + height);
    const loc3 = new Point(loc.x, loc.y + height);
    const loc4 = new Point(loc.x + width, loc.y);
    if (
      this.viewport.isInViewport(this.viewport.worldToViewport(loc)) ||
      this.viewport.isInViewport(this.viewport.worldToViewport(loc2)) ||
      this.viewport.isInViewport(this.viewport.worldToViewport(loc3)) ||
      this.viewport.isInViewport(this.viewport.worldToViewport(loc4))
    ) {
      const topLeft = this.viewport.worldToViewport(loc);
      const bottomRight = this.viewport.worldToViewport(loc2);
      const newWidth = bottomRight.x - topLeft.x;
      const newHeight = bottomRight.y - topLeft.y;
      return { topLeft, width: newWidth, height: newHeight };
    }
    return null;
  }

  // calculate a line in world coordinates
  // will return the end points of the line in the viewport
  calculateLine(from: Point, to: Point) {
    let intersect = Intersection.intersectLineRectangle(
      from,
      to,
      this.boardRect.topLeft,
      this.boardRect.bottomRight,
    );
    if (intersect) {
      if (intersect.points.length >= 2) {
        intersect = {
          from: intersect.points[0],
          to: intersect.points[1],
        };
      } else if (intersect.points.length === 1) {
        if (this.viewport.isWorldPointVisible(from)) {
          intersect = {
            from: from,
            to: intersect.points[0],
          };
        } else if (this.viewport.isWorldPointVisible(to)) {
          intersect = {
            from: to,
            to: intersect.points[0],
          };
        } else {
          throw new Error('No lines should be drawn outside of the viewport');
        }
      } else {
        // if we're completely outside of the viewport, do nothing
        return;
      }

      return intersect;
    }
  }

  drawGridLine(from: Point, to: Point) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeStyle = 'gray';
    this.ctx.lineWidth = this.viewport.toZoom(0.5);
    this.ctx.moveTo(
      0.5 + Math.round(this.viewport.worldToViewport(to).x),
      0.5 + Math.round(this.viewport.worldToViewport(to).y),
    );
    this.ctx.lineTo(
      0.5 + Math.round(this.viewport.worldToViewport(from).x),
      0.5 + Math.round(this.viewport.worldToViewport(from).y),
    );
    this.ctx.stroke();
  }
}

class Minimap {
  canvas: HTMLElement;
  ctx: CanvasRenderingContext2D;
  viewport: Viewport;
  world: World;
  isPanning: boolean;

  constructor(world: World, canvas: HTMLElement, viewport: Viewport) {
    this.viewport = viewport;
    this.world = world;
    this.canvas = canvas;

    this.isPanning = false;

    // $FlowFixMe
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.translate(0.5, 0.5)

    this.setupEvents();
    this.canvas.style.cursor = 'crosshair';
  }

  setupEvents() {
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    // $FlowFixMe
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  handleMouseDown(event) {
    this.isPanning = true;
    this.canvas.style.cursor = 'move';
    this.handleMouseMove(event);
  }

  handleMouseUp() {
    this.isPanning = false;
    this.canvas.style.cursor = 'crosshair';
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isPanning) {
      this.viewport.jump({
        x: Math.round((event.offsetX / MINIMAP_WIDTH) * this.viewport.sceneSize.width),
        y: Math.round((event.offsetY / MINIMAP_HEIGHT) * this.viewport.sceneSize.height),
      });
    }
  }

  draw() {
    const ctx = this.ctx;
    const { viewportSize, sceneSize } = this.viewport;
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
        const cell = this.world.board[x][y];
        if (cell) {
          ctx.beginPath();
          ctx.fillStyle = cell.color;
          ctx.fillRect(
            0.5 + Math.round((x / SCENE_CELLS_WIDTH) * MINIMAP_WIDTH),
            0.5 + Math.round((y / SCENE_CELLS_HEIGHT) * MINIMAP_HEIGHT),
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
    ctx.lineWidth = 1;
    const { width, height } = this.viewport.getViewportRealSize();
    ctx.rect(
      1.0 + Math.round((-this.viewport.offset.x / sceneSize.width) * MINIMAP_WIDTH),
      1.0 + Math.round((-this.viewport.offset.y / sceneSize.height) * MINIMAP_HEIGHT),
      Math.round(MINIMAP_WIDTH * (width / sceneSize.width)),
      Math.round(MINIMAP_HEIGHT * (height / sceneSize.height)),
    );
    ctx.stroke();
  }
}

class World {
  canvas: HTMLElement;
  ctx: CanvasRenderingContext2D;

  viewport: Viewport;
  region: Region;
  minimap: Minimap;
  tick: number;
  board: Board;

  constructor({ minimap, main }: { minimap: HTMLElement, main: HTMLElement }) {
    this.viewport = new Viewport({
      width: SCENE_WIDTH,
      height: SCENE_HEIGHT
    }, {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
    }, main);
    this.tick = 0;
    window.viewport = this.viewport;
    this.board = randomizeBoard(makeBoard());
    this.region = new Region(this, main, this.viewport);
    this.minimap = new Minimap(this, minimap, this.viewport);
  }

  draw() {
    this.region.draw();
    this.minimap.draw();
  }

  update() {
    this.viewport.tick();

    // if (this.tick % 120099 === 0) {
    //   this.board = randomizeBoard(cleanBoard(this.board));
    //   console.log('new board');
    // }
    this.tick++;
  }

  loop() {
    this.update();
    this.draw();

    requestAnimationFrame(() => {
      this.loop();
    });
  }
}
