// @flow
import { System } from '../entityManager';
import type Viewport from '../viewport';
import type EntityManager, { ComponentClass } from '../entityManager';


// base class for any System that handles RenderComponents
export default class RenderSystem extends System {
  viewport: Viewport;
  ctx: CanvasRenderingContext2D;

  constructor(manager: EntityManager, viewport: Viewport, ctx: CanvasRenderingContext2D) {
    super(manager);
    this.viewport = viewport;
    this.ctx = ctx;
  }

  update() {
    for (const comp: ComponentClass of this.getComponents()) {
      comp.update();
    }
  }

  draw() {
    this.getComponents().forEach((comp: ComponentClass) => {
      comp.draw(this.viewport, this.ctx);
    });
  }
}
