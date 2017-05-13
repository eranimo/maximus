// @flow
import EventTrigger from './eventTrigger';
import type Point from '../geometry/point';
import Rectangle from '../geometry/rectangle';
import { CELL_SIZE } from '../constants';


// all entities that occupy a space on the grid have a MapPosition component
export class MapPosition extends EventTrigger {
  state: {
    position: Point,
    weight: number,
    positionType: 'cell' | 'point',
    bounds: Rectangle
  }
  systems: Object;

  static initialState = {
    positionType: 'point',
  };

  get bounds(): Rectangle {
    if (this.state.positionType === 'point') {
      return new Rectangle(
        this.state.position,
        CELL_SIZE,
        CELL_SIZE
      );
    }
    return new Rectangle(
      this.state.position.multiply(CELL_SIZE),
      CELL_SIZE,
      CELL_SIZE
    );
  }

  get minimapCoord(): number {
    if (this.state.positionType === 'point') {
      return this.state.position;
    }
    return this.state.position;
  }

  init() {
    this.systems.GridSystem.registerCell(this);
  }

  onMouseUp() {
    this.systems.GridSystem.activeCell = this;
  }
}
