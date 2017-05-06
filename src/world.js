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
import Point from './point';
import DisplaySystem from './systems/display';
import UISystem from './systems/ui';

import Box from './components/box';
import { MinimapPoint, MinimapBackdrop, MinimapFrame } from './components/minimap';

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
  displaySystem: DisplaySystem;
  uiSystem: DisplaySystem;

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
    this.manager.registerComponent('display', Box);
    this.manager.registerComponent('minimapPoint', MinimapPoint);
    this.manager.registerComponent('minimapBackdrop', MinimapBackdrop);
    this.manager.registerComponent('minimapFrame', MinimapFrame);
    this.displaySystem = new DisplaySystem(this.manager, this.viewport, this.region.ctx);
    this.uiSystem = new UISystem(this.manager, this.viewport, this.minimap.ctx);

    makeBuilding(this.manager, new Point(10, 10), 'b1');
    makeMinimap(this.manager);
  }

  draw(timeSinceLastUpdate: number) {
    this.region.draw(timeSinceLastUpdate);
    this.displaySystem.draw();
    this.uiSystem.draw();
  }

  update() {
    this.viewport.tick();
    this.displaySystem.update();
    this.uiSystem.update();
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
