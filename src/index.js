// @flow
import './style.css';
import World from './world';
import {
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  MINIMAP_WIDTH,
  MINIMAP_HEIGHT,
} from './constants';


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
  if (!mainCanvas) {
    throw new Error('Fuck flowtype');
  }
  mainCanvas.setAttribute('width', `${VIEWPORT_WIDTH}px`);
  mainCanvas.setAttribute('height', `${VIEWPORT_HEIGHT}px`);

  const world: World = new World({
    main: mainCanvas,
  });
  world.loop();
};
