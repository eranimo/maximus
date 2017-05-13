// @flow
import { System } from '../entityManager';
import type EventManager from '../entityManager';
import { GridCell } from '../components/gridCell';
import { SCENE_CELLS_WIDTH, SCENE_CELLS_HEIGHT } from '../constants';
import GridWorker from 'worker-loader!../workers/gridWorker';


// a system that handles browser events passed to components
export default class GridSystem extends System {
  static componentTypes = [
    GridCell,
  ];

  activeCell: GridCell;
  worker: GridWorker;

  constructor(manager: EventManager) {
    super(manager);

    this.worker = new GridWorker();
    this.worker.postMessage({
      type: 'init',
      payload: {
        width: SCENE_CELLS_WIDTH,
        height: SCENE_CELLS_HEIGHT
      }
    });
  }

  registerCell(cell: GridCell) {
    this.worker.postMessage({
      type: 'set',
      payload: {
        x: cell.state.position.x,
        y: cell.state.position.y,
        weight: cell.state.weight,
      }
    });
  }

  update() {
    if (this.activeCell) {
      console.log(this.activeCell);
    }
  }
}
