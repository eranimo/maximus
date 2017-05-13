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
    alert('click on person!');
  }

  onMouseEnter() {
    this.avatar.state.opacity = 0.5;
  }

  onMouseLeave() {
    this.avatar.state.opacity = 1;
  }
}
