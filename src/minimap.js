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
    // const toZoom = this.viewport.toZoom.bind(this.viewport);
    // const fromZoom = this.viewport.fromZoom.bind(this.viewport);
    //
    // const minimapOrigin = {
    //   x: 0.5 + viewportSize.width - MINIMAP_WIDTH,
    //   y: 0.5 + viewportSize.height - MINIMAP_HEIGHT,
    // };

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
        const cell = this.world.board.grid[x][y];
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
