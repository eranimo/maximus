// @flow
import { System } from '../entityManager';
import type ViewportSystem from './viewport';
import type EntityManager, { ComponentClass } from '../entityManager';


// base class for any System that handles RenderComponents
export default class RenderSystem extends System {
  viewport: ViewportSystem;
  ctx: CanvasRenderingContext2D;

  init() {
    this.ctx = this.systems.region.ctx;
    this.viewport = this.systems.viewport;
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
