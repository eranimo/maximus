// @flow
import EventTrigger from './eventTrigger';
import type Point from '../geometry/point';
import { CELL_SIZE } from '../constants';
import Rectangle from '../geometry/rectangle';

// all entities that occupy a space on the grid have a GridCell component
export class GridCell extends EventTrigger {
  state: {
    position: Point,
    isWalkable: boolean,
    bounds: Rectangle
  }
  systems: Object;

  onMouseUp() {
    this.systems.GridSystem.activeCell = this;
  }
}
