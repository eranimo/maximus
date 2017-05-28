// @flow
import type { ComponentClass } from './component';
import type EntityManager from './entityManager';
import EventEmitter from 'eventemitter3';


export default class System extends EventEmitter {
  manager: EntityManager;
  components: Set<ComponentClass>;
  static componentTypes: Array<Class<ComponentClass>> = [];

  refetch() {
    this.components = new Set();
    this.getComponents().forEach((comp: ComponentClass) => {
      this.components.add(comp);
    });
  }

  get systems(): { [string]: $Subtype<System> } {
    return this.manager.systems;
  }

  // gets the components this system cares about
  getComponents(): Array<ComponentClass> {
    let foundComponents: Array<ComponentClass> = [];
    for (const type: Class<ComponentClass> of this.constructor.componentTypes) {
      for (const comp: ComponentClass of this.manager.componentInstances) {
        if (comp instanceof type) {
          foundComponents.push(comp);
        }
      }
    }
    return foundComponents;
  }
  init() {}
  draw(timeSinceLastUpdate: number) {} // eslint-disable-line
  update() {}
}
