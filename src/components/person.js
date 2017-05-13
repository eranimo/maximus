// @flow
import EventTrigger from './eventTrigger';
import Rectangle from '../geometry/rectangle';
import type { MapPosition } from './position';
import { CELL_SIZE } from '../constants';

export class PersonTrigger extends EventTrigger {
  static dependencies = {
    pos: 'MapPosition',
  }
  pos: MapPosition;

  get bounds(): Rectangle {
    return new Rectangle(
      this.pos.state.position,
      CELL_SIZE,
      CELL_SIZE
    );
  }

  onMouseUp() {
    alert('click on person!');
  }
}
