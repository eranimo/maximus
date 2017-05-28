// @flow
import MinimapPoint from '../components/minimapPoint';
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
import { VIEWPORT_MOVE } from '../events';


// handles rendering minimap components
export default class MinimapUISystem extends System {
  static componentTypes = [
    MinimapPoint,
  ];
  borderLayer: Layer;
  staticLayer: Layer;
  movingLayer: Layer;
  frameLayer: Layer;


  bounds: Rectangle;
  isPanning: boolean;
  shouldDrawStatics: boolean;
  staticComponents: Set<ComponentClass>;
  movingComponents: Set<ComponentClass>;

  constructor() {
    super();
    this.borderLayer = new Layer('minimap-border', 4, false);
    this.staticLayer = new Layer('minimap-statics', 5, false);
    this.movingLayer = new Layer('minimap-main', 6, false);
    this.frameLayer = new Layer('minimap-frame', 7, false);

    this.bounds = new Rectangle(
      new Point(
        window.innerWidth - MINIMAP_WIDTH,
        window.innerHeight - MINIMAP_HEIGHT,
      ),
      MINIMAP_WIDTH + 2,
      MINIMAP_HEIGHT + 2
    );

    this.staticComponents = new Set();
    this.movingComponents = new Set();
  }

  init() {
    const eventLayer = this.systems.viewport.canvas;
    eventLayer.addEventListener('mousedown', this.onMouseDown.bind(this));
    eventLayer.addEventListener('mousemove', this.onMouseMove.bind(this));
    eventLayer.addEventListener('mouseup', this.onMouseUp.bind(this));
    eventLayer.addEventListener('mouseleave', this.onMouseLeave.bind(this));

    this.shouldDrawStatics = true;
    this.systems.viewport.on(VIEWPORT_MOVE, () => {
      this.shouldDrawStatics = true;
      this.staticLayer.clear();
    });

    this.on('refetch', this.onRefetch);
  }

  onRefetch() {
    for (const comp: ComponentClass of this.components) {
      if (comp.state.isStatic) {
        this.staticComponents.add(comp);
      } else {
        this.movingComponents.add(comp);
      }
    }
  }

  update() {
    for (const comp: ComponentClass of this.components) {
      comp.update();
    }
  }

  drawBorder() {
    const { ctx } = this.borderLayer;
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
  }

  drawStatic() {
    for (const comp: ComponentClass of this.staticComponents) {
      comp.draw(this.staticLayer.ctx);
    }
  }

  drawMoving() {
    for (const comp: ComponentClass of this.movingComponents) {
      comp.draw(this.movingLayer.ctx);
    }
  }

  drawFrame() {
    const { ctx } = this.frameLayer;

    ctx.rect(
      0 + Math.round(this.bounds.position.x),
      0 + Math.round(this.bounds.position.y),
      MINIMAP_WIDTH,
      MINIMAP_HEIGHT,
    );
    ctx.clip();

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    const { width, height } = this.systems.viewport.getViewportRealSize();
    ctx.rect(
      0.5 + Math.round(this.bounds.position.x + (-this.systems.viewport.offset.x / SCENE_WIDTH) * MINIMAP_WIDTH),
      0.5 + Math.round(this.bounds.position.y + (-this.systems.viewport.offset.y / SCENE_HEIGHT) * MINIMAP_HEIGHT),
      Math.round(MINIMAP_WIDTH * (width / SCENE_WIDTH)),
      Math.round(MINIMAP_HEIGHT * (height / SCENE_HEIGHT)),
    );
    ctx.stroke();
  }

  draw() {
    if (this.shouldDrawStatics) {
      this.borderLayer.clear();
      this.drawBorder();

      this.staticLayer.clear();
      this.drawStatic();
    }

    this.movingLayer.clear();
    this.drawMoving();

    if (this.shouldDrawStatics) {
      this.frameLayer.clear();
      this.drawFrame();
      this.shouldDrawStatics = false;
    }
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
    this.manager.systems.viewport.jump(worldPoint);
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
      this.manager.systems.viewport.jump(worldPoint);
    }
  }
}
