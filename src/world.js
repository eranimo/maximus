// @flow
import Viewport from './viewport';
import Region from './region';
import Minimap from './minimap';
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

import Box from './components/box';
import { MinimapPoint, MinimapBackdrop, MinimapFrame } from './components/minimap';
import { UIViewportText, UIWorldText } from './components/ui';
import EventTrigger from './components/eventTrigger';
import { makeBuilding, makeMinimap } from './entityFactory';


export default class World {
  canvas: HTMLElement;
  ctx: CanvasRenderingContext2D;

  viewport: Viewport;
  region: Region;
  minimap: Minimap;
  tick: number;
  time: number;
  speed: number;

  manager: EntityManager;

  eventSystem: EventSystem;
  displaySystem: DisplaySystem;
  minimapUISystem: MinimapUISystem;
  uiSystem: UISystem;

  constructor({ minimap, main }: { minimap: HTMLElement, main: HTMLElement }) {
    this.viewport = new Viewport({
      width: SCENE_WIDTH,
      height: SCENE_HEIGHT
    }, {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
    }, main);
    this.tick = 0;
    window.viewport = this.viewport;
    this.region = new Region(this, main, this.viewport);
    this.minimap = new Minimap(this, minimap, this.viewport);
    this.time = 1;
    this.speed = 1;

    this.manager = new EntityManager();

    this.manager.registerComponents([
      ['box', Box],
      ['viewportText', UIViewportText],
      ['worldText', UIWorldText],
      ['eventTrigger', EventTrigger],
      ['minimapPoint', MinimapPoint],
      ['minimapBackdrop', MinimapBackdrop],
      ['minimapFrame', MinimapFrame],
    ]);

    this.eventSystem = new EventSystem(this.manager, this.viewport, this.region.canvas);
    this.displaySystem = new DisplaySystem(this.manager, this.viewport, this.region.ctx);
    this.minimapUISystem = new MinimapUISystem(this.manager, this.viewport, this.minimap.ctx);
    this.uiSystem = new UISystem(this.manager, this.viewport, this.region.ctx);

    const building: any = makeBuilding(this.manager, new Point(10, 10), 'b1');
    makeMinimap(this.manager);
    console.log(building);
  }

  draw(timeSinceLastUpdate: number) {
    this.region.draw(timeSinceLastUpdate);
    this.displaySystem.draw();
    this.uiSystem.draw();
    this.minimapUISystem.draw();
  }

  update() {
    this.viewport.tick();
    this.eventSystem.update();
    this.displaySystem.update();
    this.uiSystem.update();
    this.minimapUISystem.update();
    this.tick++;
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

        this.time = this.time + (timeSinceLastUpdate * this.speed);
      }
      this.draw(timeSinceLastUpdate);
      timeSinceLastUpdate = 0;
      requestAnimationFrame(execute);
    };

    requestAnimationFrame(execute);
  }
}
