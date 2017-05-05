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

  update() {
    throw new Error('Not implemented');
  }
}

export class Entity {
  components: Map<string, $Subtype<Component>>;

  constructor() {
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

export default class EntityManager {
  entities: Array<Entity>;
  componentMap: Map<string, Class<Component>>;

  constructor() {
    this.componentMap = new Map();
    this.entities = [];
  }

  addEntity(components: { [string]: Object }): Entity {
    const entity: Entity = new Entity();
    for (const [identifier, state]: [string, any] of Object.entries(components)) {
      const _class: ?Class<Component> = this.componentMap.get(identifier);
      if (_class) {
        const component: Component = new _class(entity, state);
        entity.addComponent(identifier, component);
      }
    }
    this.entities.push(entity);
    return entity;
  }

  registerComponent(name: string, component: Class<Component>) {
    this.componentMap.set(name, component);
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
