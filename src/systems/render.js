import { System } from '../entityManager';
import type Viewport from '../viewport';
import type EntityManager from '../entityManager';


export default class RenderSystem extends System {
  viewport: Viewport;
  ctx: CanvasRenderingContext2D;

  constructor(manager: EntityManager, viewport: Viewport, ctx: CanvasRenderingContext2D) {
    super(manager);
    this.viewport = viewport;
    this.ctx = ctx;
  }
}
