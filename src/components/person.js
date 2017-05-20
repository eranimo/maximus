// @flow
import EventTrigger from './eventTrigger';
import Rectangle from '../geometry/rectangle';
import type { MapPosition } from './position';
import type { Avatar } from './avatar';


export class PersonTrigger extends EventTrigger {
  static dependencies = {
    pos: 'MapPosition',
    avatar: 'Avatar'
  }
  pos: MapPosition;
  avatar: Avatar;

  get bounds(): Rectangle {
    return this.pos.bounds;
  }

  onMouseUp() {
    this.systems.selection.toggle(this.entity);
  }

  onMouseEnter() {
    this.avatar.state.isHover = true;
  }

  onMouseLeave() {
    this.avatar.state.isHover = false;
  }
}
