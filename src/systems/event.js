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
  activeEvents: Array<Event>;
  mouseMoveComponents: Set<Component>;

  constructor(manager: EventManager, viewport: Viewport, canvas: HTMLCanvasElement) {
    super(manager);
    this.viewport = viewport;
    this.canvas = canvas;
    this.activeEvents = [];
    this.mouseMoveComponents = new Set();

    this.canvas.addEventListener('mousedown', this.handleEvent.bind(this));
    this.canvas.addEventListener('mousemove', this.handleEvent.bind(this));
    this.canvas.addEventListener('mouseout', this.handleEvent.bind(this));
    this.canvas.addEventListener('mousedown', this.handleEvent.bind(this));
    this.canvas.addEventListener('mouseup', this.handleEvent.bind(this));
  }

  handleEvent(event: Event) {
    this.activeEvents.push(event);
  }

  processEvent(event: MouseEvent, callback: Function) {
    const { offsetX: x, offsetY: y } = event;
    const viewportPoint = new Point(x, y);
    const worldPoint: Point = this.viewport.viewportToWorld(viewportPoint);
    this.getComponents().forEach((comp: Component): void => callback(comp, viewportPoint, worldPoint));
  }

  update() {
    for (const event: Event of this.activeEvents) {
      switch (event.type) {
        case 'mousemove':
          this.handleMouseMove(event);
        break;
        case 'mouseout':
          this.handleMouseOut(event);
        break;
        case 'mousedown':
          this.handleMouseDown(event);
        break;
        case 'mouseup':
          this.handleMouseUp(event);
        break;
        default:
          throw new Error(`Event type ${event.type} is unhandled`);
      }
    }
    this.activeEvents = [];

    for (const comp: Component of this.getComponents()) {
      comp.update();
    }
  }

  handleMouseDown(event: MouseEvent) {
    this.processEvent(event, (comp: Component, viewportPoint: Point, worldPoint: Point) => {
      if (this.mouseMoveComponents.has(comp) && comp.onMouseDown) {
        comp.onMouseDown(viewportPoint);
      }
    });
  }

  handleMouseUp(event: MouseEvent) {
    this.processEvent(event, (comp: Component, point: Point) => {
      if (this.mouseMoveComponents.has(comp) && comp.onMouseUp) {
        comp.trigger('onMouseUp', [point]);
      }
    });
  }

  handleMouseOut(event: MouseEvent) {
    const { offsetX: x, offsetY: y } = event;
    const point: Point = this.viewport.viewportToWorld(new Point(x, y));
    for (const comp of this.mouseMoveComponents) {
      comp.trigger('onMouseLeave', [point]);
    }
  }

  handleMouseMove(event: MouseEvent) {
    this.processEvent(event, (comp: Component, viewportPoint: Point, worldPoint: Point) => {
      const isAtComponent = comp.state.bounds.containsPoint(viewportPoint);
      // console.log(this.mouseMoveComponents.has(comp), !isAtComponent, !!comp.onMouseLeave);
      if (this.mouseMoveComponents.has(comp) && !isAtComponent) {
        comp.trigger('onMouseLeave', [worldPoint]);
      }

      if (!this.mouseMoveComponents.has(comp) && isAtComponent) {
        comp.trigger('onMouseEnter', [worldPoint]);
      }

      if (isAtComponent) {
        comp.trigger('onMouseMove', [viewportPoint]);
        this.mouseMoveComponents.add(comp);
      } else {
        this.mouseMoveComponents.delete(comp);
      }
    });
  }
}
