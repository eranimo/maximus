//@flow
import type { Size } from '../index';
import Point from '../geometry/point';
import { System } from '../entityManager';
import anime from 'animejs';
import _ from 'lodash';
import {
  SCENE_WIDTH,
  CELL_SIZE,
  SCENE_CELLS_WIDTH,
  ZOOM_INTERVAL,
  ZOOM_MIN,
  ZOOM_MAX,
} from '../constants';


export default class ViewportSystem extends System {
  isPanning: boolean;
  sceneSize: Size;
  viewportSize: Size;
  panLocation: ?Point;
  offset: Point;
  cursorLocation: Point;
  zoomLevel: number;
  canvas: HTMLElement;
  keysPressed: Object;
  topLeft: Point;
  bottomRight: Point;
  cellHover: ?Point;

  constructor(sceneSize: Size, viewportSize: Size, canvas: HTMLElement) {
    super();
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
    this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
    this.canvas.addEventListener('wheel', this.handleZoom.bind(this));
    document.addEventListener('keyup', (event: KeyboardEvent) => {
      this.keysPressed[event.keyCode] = false;
      this.handleKeyup(event);
    });
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      this.keysPressed[event.keyCode] = true;
    });

    this.onMovement();
  }

  handleMouseOut(event: MouseEvent) {
    this.cellHover = null;
    this.panUp(event);
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

  update() {
    this.checkBoardHover();
    this.checkKeysPressed();
  }

  isKeyPressed(keyCode: number): boolean {
    return this.keysPressed[keyCode] === true;
  }

  handleKeyup(event: KeyboardEvent) {
    if (event.keyCode === 32) {
      this.changeZoomLevel(1, this.cursorLocation.x, this.cursorLocation.y);
    } else if (event.keyCode === 13) {
      this.travel({
        x: SCENE_WIDTH / 2,
        y: SCENE_WIDTH / 2,
      }, 100);
    }
  }

  checkBoardHover() {
    const worldCursor = this.viewportToWorld(this.cursorLocation);
    this.cellHover = {
      x: Math.floor(worldCursor.x / CELL_SIZE),
      y: Math.floor(worldCursor.y / CELL_SIZE),
    };
    if (this.cellHover.x < 0 || this.cellHover.x > SCENE_CELLS_WIDTH ||
        this.cellHover.y < 0 || this.cellHover.y > SCENE_CELLS_WIDTH) {
      this.cellHover = null;
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
    if (didSomething) {
      this.cellHover = null;
    }
    return didSomething;
  }

  // the world coordinate at the center of the screen
  get center(): Point {
    return {
      x: this.toZoom((this.viewportSize.width / 2) - this.offset.x),
      y: this.toZoom((this.viewportSize.height / 2) - this.offset.y),
    };
  }

  handleZoom(event: WheelEvent) {
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

  changeZoomLevel(zoomLevel: number, x: number = this.center.x, y: number = this.center.y) {
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

  jump(coord: Point) {
    this.offset = {
      x: -coord.x + this.fromZoom(this.viewportSize.width / 2),
      y: -coord.y + this.fromZoom(this.viewportSize.height / 2),
    };
    // console.log('Jump to:', this.offset);
    this.onMovement();
  }

  travel({ x, y }: Point, duration: number = 1000){
    // console.log(`Travel to ${x}, ${y} from ${this.center.x}, ${this.center.y}`);
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
    });
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
      };
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

  worldToViewport(coord: Point): Point {
    return new Point({
      x: this.toZoom(this.offset.x + coord.x),
      y: this.toZoom(this.offset.y + coord.y),
    });
  }

  // convert viewport coordinates to world coordinates
  viewportToWorld(coord: Point): Point {
    return new Point({
      x: this.fromZoom(coord.x) - this.offset.x,
      y: this.fromZoom(coord.y) - this.offset.y,
    });
  }

  // is viewport coordinate in viewport
  isInViewport(coord: Point): boolean {
    const { width, height } = this.viewportSize;
    return coord.x >= 0 && coord.y >= 0 &&
           coord.x <= width && coord.y <= height;
  }

  // TODO: make this work
  clampViewport(coord: Point): Point {
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
  isWorldPointVisible(point: Point): boolean {
    point = this.viewportToWorld(point);
    return this.topLeft.x >= point.x && point.x <= this.bottomRight.x ||
           this.topLeft.y >= point.y && point.y <= this.bottomRight.y;
  }

  calculateBounds(loc: Point, width: number, height: number): ?Object {
    const loc2 = new Point(loc.x + width, loc.y + height);
    const loc3 = new Point(loc.x, loc.y + height);
    const loc4 = new Point(loc.x + width, loc.y);
    if (
      this.isInViewport(this.worldToViewport(loc)) ||
      this.isInViewport(this.worldToViewport(loc2)) ||
      this.isInViewport(this.worldToViewport(loc3)) ||
      this.isInViewport(this.worldToViewport(loc4))
    ) {
      const topLeft = this.worldToViewport(loc);
      const bottomRight = this.worldToViewport(loc2);
      const newWidth = bottomRight.x - topLeft.x;
      const newHeight = bottomRight.y - topLeft.y;
      return { topLeft, width: newWidth, height: newHeight };
    }
    return null;
  }
}
