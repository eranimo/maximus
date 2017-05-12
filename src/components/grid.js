// @flow
import { Component } from '../entityManager';
import EventTrigger from './eventTrigger';
import type Point from '../geometry/point';


export class Grid extends Component {
  state: {
    selectedCell: Point,
  };

  init() {
    this.state.selectedCell = null;
  }

  deselect() {
    this.state.selectedCell = null;
  }
}

// all entities that occupy a space on the grid have a GridCell component
export default class GridCell extends EventTrigger {
  position: Point
}
