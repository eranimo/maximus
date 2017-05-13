// @flow
import { System } from '../entityManager';
import type EventManager from '../entityManager';
import { GridCell } from '../components/gridCell';
import { SCENE_CELLS_WIDTH, SCENE_CELLS_HEIGHT } from '../constants';


// a system that handles browser events passed to components
export default class GridSystem extends System {
  static componentTypes = [
    GridCell,
  ];

  activeCell: GridCell;

  constructor(manager: EventManager) {
    super(manager);
  }

  registerCell() {
  }

  update() {
    if (this.activeCell) {
      console.log(this.activeCell);
    }
  }
}
