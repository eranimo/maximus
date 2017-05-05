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

  constructor(entity: Entity, state: Object) {
    this.entity = entity;
    this.init(state);
  }

  init(state: Object) {}

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
}

export default class EntityManager {
  entities: Array<Entity>;
  componentMap: Map<Class<Component>, string>;

  constructor() {
    this.componentMap = new Map();
    this.entities = [];
  }

  addEntity(components: Map<Class<Component>, Object>, state: Object = {}): Entity {
    const entity: Entity = new Entity(state);
    for (const [comp, state]: [Class<Component>, Object] of components) {
      const identifier: ?string = this.componentMap.get(comp);
      if (identifier) {
        const component: Component = new comp(entity, state);
        entity.addComponent(identifier, component);
      }
    }
    this.entities.push(entity);
    return entity;
  }

  addComponent(name: string, component: Class<Component>) {
    this.componentMap.set(component, name);
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
