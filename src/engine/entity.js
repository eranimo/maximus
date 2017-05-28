// @flow
import type { ComponentClass } from './component';
import type Component from './component';
import type EntityManager from './entityManager';


let currentEntityID = 0;

export interface EntityType {
  components(options: { [string]: any }): $Subtype<Component>,
}

export default class Entity {
  name: ?string;
  manager: EntityManager;
  components: Array<ComponentClass>;
  id: number;

  constructor(name: ?string) {
    this.name = name;
    this.components = [];
    this.id = currentEntityID;
    currentEntityID++;
  }

  addComponent(instance: ComponentClass) {
    this.components.push(instance);
  }

  getComponents(identifier: string): Array<ComponentClass> {
    return this.components.filter((comp: Component): boolean => comp.constructor.name === identifier);
  }

  hasComponent(identifier: string): boolean {
    return this.getComponents(identifier).length > 0;
  }

  // export(): Object {
  //   const data = {};
  //   for (const [identifier, instance]: [string, Component] of this.components.entries()) {
  //     data[identifier] = instance.state;
  //   }
  //   return data;
  // }
}
