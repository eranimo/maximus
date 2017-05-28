// @flow
import './style.css';
import World from './world';
import {
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
} from './constants';
import loadTilemap from './misc/tilemap';


export type Cell = {
  color: string
}

export type Size = {
  width: number,
  height: number
};


window.onload = () => {
  // $FlowFixMe
  const mainCanvas: HTMLElement = document.getElementById('gameCanvas');
  mainCanvas.setAttribute('width', `${VIEWPORT_WIDTH}px`);
  mainCanvas.setAttribute('height', `${VIEWPORT_HEIGHT}px`);

  loadTilemap()
    .then((spritemaps: Object) => {
      console.log(spritemaps);
      const world: World = new World({
        main: mainCanvas,
        resources: { spritemaps }
      });
      world.loop();
    })
    .catch((error: Error) => {
      console.error(error);
    });
};
