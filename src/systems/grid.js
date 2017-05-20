// @flow
import { System } from '../entityManager';
import { MapPosition } from '../components/position';
import { SCENE_CELLS_WIDTH, SCENE_CELLS_HEIGHT } from '../constants';
import GridWorker from 'worker-loader!../workers/gridWorker';


// a system that handles browser events passed to components
export default class GridSystem extends System {
  static componentTypes = [
    MapPosition,
  ];

  activeCell: MapPosition;
  worker: GridWorker;

  constructor() {
    super();

    this.worker = new GridWorker();
    this.worker.postMessage({
      type: 'init',
      payload: {
        width: SCENE_CELLS_WIDTH,
        height: SCENE_CELLS_HEIGHT
      }
    });
  }

  registerCell(cell: MapPosition) {
    this.worker.postMessage({
      type: 'set',
      payload: {
        x: cell.state.position.x,
        y: cell.state.position.y,
        weight: cell.state.weight,
      }
    });
  }

  // update() {
  //   if (this.activeCell) {
  //     console.log(this.activeCell);
  //   }
  // }
}
