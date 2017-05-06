import EntityManager, { System } from '../entityManager';
import DisplayComponent from '../components/display';
import Viewport from '../viewport';

export default class DisplaySystem extends System {
  viewport: Viewport;
  ctx: CanvasRenderingContext2D;

  static componentTypes = [
    DisplayComponent,
  ];

  constructor(manager: EntityManager, viewport: Viewport, ctx: CanvasRenderingContext2D) {
    super(manager);
    this.viewport = viewport;
    this.ctx = ctx;
  }

  update() {
    for (const comp: DisplayComponent of this.getComponents()) {
      comp.update();
    }
  }

  draw() {
    this.getComponents().forEach((comp: Component) => {
      comp.draw(this.viewport, this.ctx);
    });
  }
}
