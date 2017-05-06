// @flow


/*

Component:
  - a class that encapsulates a behavior
Entity:
  - a container of components
  - has a state object
EntityManager:
  - creates entities from objects with attached components
System:
  - a function that gets entities with certain components and does something with them

*/
export class Component {
  entity: Entity;
  state: Object;

  constructor(entity: Entity, state: Object) {
    this.entity = entity;
    this.state = state;
    this.init();
  }

  init() {}
  update() {}

  on(event: GameEvent) {} // eslint-disable-line
}

export class Entity {
  name: ?string;
  components: Map<string, $Subtype<Component>>;

  constructor(name: ?string) {
    this.name = name;
    this.components = new Map();
  }

  addComponent(identifier: string, instance: $Subtype<Component>) {
    this.components.set(identifier, instance);
  }

  getComponent(identifier: string): ?$Subtype<Component> {
    return this.components.get(identifier);
  }

  export(): Object {
    const data = {};
    for (const [identifier, instance]: [string, Component] of this.components.entries()) {
      data[identifier] = instance.state;
    }
    return data;
  }
}

export type GameEvent = {
  name: string,
  value: Object,
};

export class System {
  manager: EntityManager;
  static componentTypes: Array<Class<$Subtype<Component>>> = [];

  constructor(manager: EntityManager) {
    this.manager = manager;
  }

  getComponents(): Array<$Subtype<Component>> {
    let foundComponents: Array<$Subtype<Component>> = [];
    for (const type: Class<$Subtype<Component>> of this.constructor.componentTypes) {
      foundComponents.push(...this.manager.componentInstancesMap.get(type) || []);
    }
    return foundComponents;
  }

  update() {
    throw new Error('Not implemented');
  }
}

export default class EntityManager {
  entities: Array<Entity>;
  componentTypes: Map<string, Class<Component>>;
  componentInstancesMap: Map<Class<$Subtype<Component>>, Array<$Subtype<Component>>>;

  constructor() {
    this.componentTypes = new Map();
    this.componentInstancesMap = new Map();
    this.entities = [];
  }

  addEntity(components: { [string]: Object }, name: ?string): Entity {
    const entity: Entity = new Entity(name);
    for (const [identifier, state]: [string, any] of Object.entries(components)) {
      const _class: ?Class<Component> = this.componentTypes.get(identifier);
      if (_class) {
        const component: Component = new _class(entity, state);
        this.componentInstancesMap.set(_class, [
          ...this.componentInstancesMap.get(_class) || [],
          component,
        ]);
        entity.addComponent(identifier, component);
      }
    }
    this.entities.push(entity);
    return entity;
  }

  registerComponent(name: string, component: Class<Component>) {
    this.componentTypes.set(name, component);
  }

  getComponents(identifier: string): Array<Component> {
    const components: Array<Component> = [];
    for (const entity of this.entities) {
      const comp: ?Component = entity.getComponent(identifier);
      if (comp) {
        components.push(comp);
      }
    }
    return components;
  }

  // update all entities
  update() {
    for (const entity of this.entities) {
      for (const [identifier, instance]: [string, Component] of entity.components.entries()) {
        instance.update();
      }
    }
  }
}
