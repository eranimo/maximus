// @flow
import { MinimapPoint } from '../components/minimap';
import Layer from '../misc/layer';
import Rectangle from '../geometry/rectangle';
import Point from '../geometry/point';
import System from '../engine/system';
import type { ComponentClass } from '../engine/component';
import {
  MINIMAP_WIDTH,
  MINIMAP_HEIGHT,
  SCENE_WIDTH,
  SCENE_HEIGHT,
} from '../constants';
import { VIEWPORT_JUMP } from '../events';


// handles rendering minimap components
export default class MinimapUISystem extends System {
  static componentTypes = [
    MinimapPoint,
  ];
  layer: Layer;
  bounds: Rectangle;
  isPanning: boolean;

  constructor() {
    super();
    this.layer = new Layer('minimap', 4, false);
    this.bounds = new Rectangle(
      new Point(
        window.innerWidth - MINIMAP_WIDTH,
        window.innerHeight - MINIMAP_HEIGHT,
      ),
      MINIMAP_WIDTH + 2,
      MINIMAP_HEIGHT + 2
    );
  }

  init() {
    const eventLayer = this.systems.viewport.canvas;
    eventLayer.addEventListener('mousedown', this.onMouseDown.bind(this));
    eventLayer.addEventListener('mousemove', this.onMouseMove.bind(this));
    eventLayer.addEventListener('mouseup', this.onMouseUp.bind(this));
    eventLayer.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }

  update() {
    for (const comp: ComponentClass of this.components) {
      comp.update();
    }
  }

  draw() {
    this.layer.clear();
    const { ctx } = this.layer;

    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.rect(
      0 + Math.round(this.bounds.position.x),
      0 + Math.round(this.bounds.position.y),
      MINIMAP_WIDTH,
      MINIMAP_HEIGHT,
    );
    ctx.stroke();
    ctx.fill();

    for (const comp: ComponentClass of this.components) {
      comp.draw();
    }

    ctx.save();
    ctx.clip();

    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    const { width, height } = this.systems.viewport.getViewportRealSize();
    ctx.rect(
      this.bounds.position.x + 1.0 + Math.round((-this.systems.viewport.offset.x / SCENE_WIDTH) * MINIMAP_WIDTH),
      this.bounds.position.y + 1.0 + Math.round((-this.systems.viewport.offset.y / SCENE_HEIGHT) * MINIMAP_HEIGHT),
      Math.round(MINIMAP_WIDTH * (width / SCENE_WIDTH)),
      Math.round(MINIMAP_HEIGHT * (height / SCENE_HEIGHT)),
    );
    ctx.stroke();
    ctx.restore();
  }

  onMouseDown(event: MouseEvent) {
    const point = new Point(event.offsetX, event.offsetY);
    if (!this.bounds.containsPoint(point)) {
      return;
    }

    this.isPanning = true;
    window.canvas.style.cursor = 'move';
    const worldPoint = new Point({
      x: Math.round(((point.x - this.bounds.position.x) / MINIMAP_WIDTH) * SCENE_WIDTH),
      y: Math.round(((point.y - this.bounds.position.y) / MINIMAP_HEIGHT) * SCENE_HEIGHT),
    });
    this.manager.emitEvent({
      name: VIEWPORT_JUMP,
      value: {
        point: worldPoint
      }
    });
  }

  onMouseLeave() {
    this.isPanning = false;
    window.canvas.style.cursor = 'crosshair';
  }

  onMouseUp(event: MouseEvent) {
    const point = new Point(event.offsetX, event.offsetY);
    if (!this.bounds.containsPoint(point)) {
      return;
    }

    this.isPanning = false;
    window.canvas.style.cursor = 'crosshair';
  }

  onMouseMove(event: MouseEvent) {
    const point = new Point(event.offsetX, event.offsetY);
    if (!this.bounds.containsPoint(point)) {
      return;
    }

    const worldPoint = new Point({
      x: Math.round(((point.x - this.bounds.position.x) / MINIMAP_WIDTH) * SCENE_WIDTH),
      y: Math.round(((point.y - this.bounds.position.y) / MINIMAP_HEIGHT) * SCENE_HEIGHT),
    });
    if (this.isPanning) {
      this.manager.emitEvent({
        name: VIEWPORT_JUMP,
        value: {
          point: worldPoint
        }
      });
    }
  }
}
