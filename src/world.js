// @flow
import Viewport from './viewport';
import Region from './region';
import Minimap from './minimap';
import Board from './board';
import {
  SCENE_WIDTH,
  SCENE_HEIGHT,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
} from './constants';


export default class World {
  canvas: HTMLElement;
  ctx: CanvasRenderingContext2D;

  viewport: Viewport;
  region: Region;
  minimap: Minimap;
  tick: number;
  board: Board;
  time: number;
  speed: number;

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
    this.board = new Board();
    this.board.randomize();
    this.region = new Region(this, main, this.viewport);
    this.minimap = new Minimap(this, minimap, this.viewport);
    this.time = 1;
    this.speed = 1;
  }

  draw(timeSinceLastUpdate: number) {
    this.region.draw(timeSinceLastUpdate);
    this.minimap.draw();
  }

  update(timeSinceLastUpdate: number) {
    this.viewport.tick();

    // if (this.tick % 120099 === 0) {
    //   this.board = randomizeBoard(cleanBoard(this.board));
    //   console.log('new board');
    // }
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
        this.update(timeSinceLastUpdate);

        this.time = this.time + (timeSinceLastUpdate * this.speed);
      }
      this.draw(timeSinceLastUpdate);
      timeSinceLastUpdate = 0;
      requestAnimationFrame(execute);
    };

    requestAnimationFrame(execute);
  }
}
