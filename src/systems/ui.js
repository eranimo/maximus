import EntityManager, { System } from '../entityManager';
import MinimapComponent from '../components/minimap';


export default class UISystem extends System {
  ctx: CanvasRenderingContext2D;

  static componentTypes = [
    MinimapComponent,
  ];

  constructor(manager: EntityManager, ctx: CanvasRenderingContext2D) {
    super(manager);
    this.ctx = ctx;
  }

  update() {
    for (const comp: DisplayComponent of this.getComponents()) {
      comp.update();
    }
  }

  draw() {
    this.getComponents().forEach((comp: Component) => {
      comp.draw(this.ctx);
    });
  }
}
