// @flow
import Viewport from './viewport';
import Region from './region';
import {
  SCENE_WIDTH,
  SCENE_HEIGHT,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
} from './constants';
import EntityManager from './entityManager';
import Point from './geometry/point';
import DisplaySystem from './systems/display';
import MinimapUISystem from './systems/minimapUI';
import EventSystem from './systems/event';
import UISystem from './systems/ui';
import GridSystem from './systems/grid';
import TimeSystem from './systems/time';

import { VIEWPORT_JUMP } from './events';
import Building from './entities/building';
import Minimap from './entities/minimap';
import Person from './entities/person';


export default class World {
  canvas: HTMLElement;
  ctx: CanvasRenderingContext2D;

  viewport: Viewport;
  region: Region;

  manager: EntityManager;

  eventSystem: EventSystem;
  displaySystem: DisplaySystem;
  minimapUISystem: MinimapUISystem;
  uiSystem: UISystem;
  gridSystem: GridSystem;
  timeSystem: TimeSystem;

  constructor({ main }: { main: HTMLElement }) {
    this.viewport = new Viewport({
      width: SCENE_WIDTH,
      height: SCENE_HEIGHT
    }, {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
    }, main);
    window.canvas = main;
    window.viewport = this.viewport;
    this.region = new Region(this, main, this.viewport);

    this.manager = new EntityManager();

    this.timeSystem = new TimeSystem(this.manager);
    this.eventSystem = new EventSystem(this.manager, this.viewport, (this.region.canvas: any));
    this.displaySystem = new DisplaySystem(this.manager, this.viewport, this.region.ctx);
    this.minimapUISystem = new MinimapUISystem(this.manager, this.viewport, this.region.ctx);
    this.uiSystem = new UISystem(this.manager, this.viewport, this.region.ctx);
    this.gridSystem = new GridSystem(this.manager);

    window.time = this.timeSystem;

    this.manager.addEntity(Building, {
      position: new Point(10, 10)
    });

    for (let i = 5; i < 15; i++) {
      this.manager.addEntity(Building, {
        position: new Point(15, i),
      });
    }

    this.manager.addEntity(Person, {
      position: new Point(11, 10),
      name: 'person_1',
    });
    this.manager.addEntity(Minimap);
    window.manager = this.manager;
  }

  draw(timeSinceLastUpdate: number) {
    this.region.draw(timeSinceLastUpdate);
    this.displaySystem.draw();
    this.uiSystem.draw();
    this.minimapUISystem.draw();
  }

  update() {
    this.manager.on(VIEWPORT_JUMP, (value: Object) => {
      this.viewport.jump(value.point);
    });
    this.manager.update();
    this.viewport.tick();
    this.manager.update();
    this.eventSystem.update();
    this.displaySystem.update();
    this.uiSystem.update();
    this.minimapUISystem.update();
    this.gridSystem.update();

    this.timeSystem.tickNumber++;
  }

  loop() {
    const VIDEO_FPS = 60;
    const refreshDelay = 1000 / VIDEO_FPS;
    let timeOfLastExecution;
    let timeSinceLastUpdate = 0;
    const execute = () => {
      const now = Date.now();

      // time since last execution
      const dt = now - (timeOfLastExecution || now);

      // set timeOfLastExecution as now
      timeOfLastExecution = now;

      // if we don't update the UI now, increase timeSinceLastUpdate by dt
      timeSinceLastUpdate += dt;

      if (timeSinceLastUpdate >= refreshDelay) {
        this.update();

        this.timeSystem.time = this.timeSystem.time + (timeSinceLastUpdate * this.timeSystem.speed);
      }
      this.draw(timeSinceLastUpdate);
      timeSinceLastUpdate = 0;
      requestAnimationFrame(execute);
    };

    requestAnimationFrame(execute);
  }
}
