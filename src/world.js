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
  }

  draw() {
    this.region.draw();
    this.minimap.draw();
  }

  update() {
    this.viewport.tick();

    // if (this.tick % 120099 === 0) {
    //   this.board = randomizeBoard(cleanBoard(this.board));
    //   console.log('new board');
    // }
    this.tick++;
  }

  loop() {
    this.update();
    this.draw();

    requestAnimationFrame(() => {
      this.loop();
    });
  }
}
