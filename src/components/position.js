// @flow
import EventTrigger from './eventTrigger';
import type Point from '../geometry/point';
import Rectangle from '../geometry/rectangle';
import Circle from '../geometry/circle';
import { CELL_SIZE } from '../constants';


// all entities that occupy a space on the grid have a MapPosition component
export class MapPosition extends EventTrigger {
  state: {
    position: Point, // top left
    radius: ?number,
    positionType: 'rectangle' | 'circle',
  }
  systems: Object;

  static initialState = {
    positionType: 'rectangle',
  };

  get bounds(): Rectangle {
    if (this.state.positionType === 'circle') {
      return Circle.fromPoint(
        this.state.position.multiply(CELL_SIZE).add(CELL_SIZE / 2),
        (CELL_SIZE / 2) * 0.75,
      );
    }
    return new Rectangle(
      this.state.position.multiply(CELL_SIZE),
      CELL_SIZE,
      CELL_SIZE
    );
  }

  init() {
    this.systems.grid.registerCell(this);
  }

  onMouseUp() {
    this.systems.grid.activeCell = this;
  }
}
