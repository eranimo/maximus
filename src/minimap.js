// @flow
import type Viewport from './viewport';
import type World from './world';
import {
  SCENE_CELLS_WIDTH,
  SCENE_CELLS_HEIGHT,
  MINIMAP_WIDTH,
  MINIMAP_HEIGHT,
} from './constants';


export default class Minimap {
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
    this.ctx.translate(0.5, 0.5);

    this.setupEvents();
    this.canvas.style.cursor = 'crosshair';
  }

  setupEvents() {
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mouseout', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  handleMouseDown(event: MouseEvent) {
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
    const { sceneSize } = this.viewport;

    // minimap background
    // ctx.beginPath();
    // ctx.fillStyle = 'white';
    // ctx.rect(
    //   0,
    //   0,
    //   MINIMAP_WIDTH,
    //   MINIMAP_HEIGHT,
    // );
    // ctx.fill();
  }
}
