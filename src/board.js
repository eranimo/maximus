// @flow
import _ from 'lodash';
import {
  SCENE_CELLS_WIDTH,
  SCENE_CELLS_HEIGHT,
} from './constants';


export default class Board {
  grid: Array<Array<any>>;

  constructor() {
    this.grid = _.times(SCENE_CELLS_WIDTH, (): any => _.times(SCENE_CELLS_HEIGHT, (): any => null));
  }

  clean() {
    for (let x = 0; x < SCENE_CELLS_WIDTH; x++) {
      for (let y = 0; y < SCENE_CELLS_HEIGHT; y++) {
        this.grid[x][y] = null;
      }
    }
  }

  randomize() {
    let cells = _.random(500, 2000);
    for (let i = 0; i < cells; i++) {
      const x = _.random(0, SCENE_CELLS_WIDTH - 1);
      const y = _.random(0, SCENE_CELLS_HEIGHT - 1);
      this.grid[x][y] = { color: 'blue' };
    }
  }

}
