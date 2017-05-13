// @flow
import EventTrigger from './eventTrigger';
import type Point from '../geometry/point';
import { CELL_SIZE } from '../constants';
import Rectangle from '../geometry/rectangle';

// all entities that occupy a space on the grid have a GridCell component
export class GridCell extends EventTrigger {
  state: {
    position: Point,
    weight: number,
    bounds: Rectangle
  }
  systems: Object;

  init() {
    this.systems.GridSystem.registerCell(this);
  }

  onMouseUp() {
    this.systems.GridSystem.activeCell = this;
  }
}
