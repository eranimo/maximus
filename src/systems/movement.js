// @flow
import type { ComponentClass } from '../engine/component';
import { Walk } from '../components/walk';
import System from '../engine/system';


// a system that displays all world entities
export default class MovementSystem extends System {
  static componentTypes = [
    Walk
  ];
  components: Set<Walk>;

  update() {
    for (const comp: ComponentClass of this.components) {
      comp.update();
    }
  }
}
