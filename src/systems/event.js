import { System } from '../entityManager';
import type EventManager from '../entityManager';
import EventTrigger from '../components/eventTrigger';
import Point from '../geometry/point';
import Viewport from '../viewport';


// a system that handles browser events passed to components
export default class EventSystem extends System {
  static componentTypes = [
    EventTrigger,
  ];
  viewport: Viewport;
  canvas: HTMLCanvasElement;

  constructor(manager: EventManager, viewport: Viewport, canvas: HTMLCanvasElement) {
    super(manager);
    this.viewport = viewport;
    this.canvas = canvas;

    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  handleMouseDown(event: MouseEvent) {
    const { offsetX: x, offsetY: y } = event;
    const point: Point = this.viewport.viewportToWorld(new Point(x, y));
    this.getComponents().forEach((comp: Component) => {
      comp.isClicked = comp.state.bounds.containsPoint(point);
    });
  }

  handleMouseMove(event: MouseEvent) {
    const { offsetX: x, offsetY: y } = event;
    const point: Point = this.viewport.viewportToWorld(new Point(x, y));
    this.getComponents().forEach((comp: Component) => {
      const isAtComponent = comp.state.bounds.containsPoint(point);
      comp.isHover = isAtComponent;
    });
  }
}
