// @flow
import type { ComponentClass } from '../entityManager';
import { Walk } from '../components/walk';
import { System } from '../entityManager';


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
