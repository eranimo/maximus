// @flow
import { System } from '../entityManager';
import type ViewportSystem from './viewport';
import type EntityManager, { ComponentClass } from '../entityManager';


// base class for any System that handles RenderComponents
export default class RenderSystem extends System {
  viewport: ViewportSystem;
  ctx: CanvasRenderingContext2D;

  init() {
    this.ctx = this.systems.viewport.ctx;
    this.viewport = this.systems.viewport;
  }

  update() {
    for (const comp: ComponentClass of this.components) {
      comp.update();
    }
  }

  draw() {
    for (const comp: ComponentClass of this.components) {
      comp.draw(this.viewport, this.ctx);
    }
  }
}
