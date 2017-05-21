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

let currentComponentID = 0;
let currentEntityID = 0;

export class Component {
  id: number;
  entity: Entity;
  state: Object;
  waitUntilTime: ?number;

  static initialState = {};

  constructor(options: Object = {}) {
    this.state = Object.assign({}, this.constructor.initialState, options);
    this.id = currentComponentID;
    currentComponentID++;
  }
  init() {}
  update() {}
  sendEvent(event: GameEvent) {
    this.entity.manager.emitEvent(event);
  }
  on(event: GameEvent) {} // eslint-disable-line

  get systems(): { [string]: $Subtype<System> } {
    return this.entity.manager.systems;
  }
}

export class Entity {
  name: ?string;
  manager: EntityManager;
  components: Array<ComponentClass>;
  id: number;

  constructor(name: ?string) {
    this.name = name;
    this.components = [];
    this.id = currentComponentID;
    currentComponentID++;
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


export interface EntityType {
  components(options: { [string]: any }): $Subtype<Component>,
}

export type GameEvent = {
  name: string,
  value: Object,
};

export class System {
  manager: EntityManager;
  static componentTypes: Array<Class<ComponentClass>> = [];

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
  draw(timeSinceLastUpdate: number) {}
  update() {}
}

export type ComponentClass = $Subtype<Component>;

export default class EntityManager {
  entities: Array<Entity>;
  componentInstances: Array<ComponentClass>;
  events: Set<GameEvent>;
  systems: { [string]: $Subtype<System> };
  eventListeners: Map<string, Array<Function>>;

  constructor(systems: { [string]: $Subtype<System> }) {
    this.componentInstances = [];
    this.entities = [];
    this.systems = systems;
    console.log(this.systems);
    for (const [name, system]: [string, any] of Object.entries(this.systems)) {
      system.manager = this;
      system.init();
    }
    this.events = new Set();
    this.eventListeners = new Map();
  }



  addEntity(entityType: Object, options: Object = {}): Entity {
    const entity: Entity = new Entity(entityType.name);
    const components = entityType.components(options);
    this.componentInstances.push(...components);
    entity.components = components;
    entity.manager = this;
    for (const instance: $Subtype<Component> of components) {
      instance.entity = entity;
      if (instance.constructor.dependencies) {
        for (const [key, depName]: [string, any] of Object.entries(instance.constructor.dependencies)) {
          const foundComponents: Array<ComponentClass> = entity.getComponents(depName);
          if (foundComponents.length === 0) {
            throw new Error(`Component '${instance.constructor.name}' is missing required component ${depName}`);
          } else if (foundComponents.length === 1) {
            instance[key] = foundComponents[0];
          } else {
            instance[key] = foundComponents;
          }
        }
      }
      instance.init();
    }
    this.entities.push(entity);
    return entity;
  }

  // TODO: ideally this shouldn't exist
  getComponents(identifier: string): Array<ComponentClass> {
    const components: Array<Component> = [];
    for (const entity of this.entities) {
      const comps: Array<Component> = entity.getComponents(identifier);
      components.push(...comps);
    }
    return components;
  }

  emitEvent(event: GameEvent) {
    this.events.add(event);
  }

  // update all entities
  update() {
    for (const entity of this.entities) {
      for (const instance: ComponentClass of entity.components) {
        if (instance.waitUntilTime) {
          if (this.systems.time.time > instance.waitUntilTime) {
            delete instance.waitUntilTime;
            instance.update();
          }
        } else {
          instance.update();
        }
      }
    }
    if (this.events.size > 0) {
      for (const event: GameEvent of this.events) {
        if (this.eventListeners.has(event.name)) {
          const listeners: ?Array<Function> = this.eventListeners.get(event.name);
          if (listeners) {
            for (const listener: Function of listeners) {
              listener(event.value);
              this.events.delete(event);
            }
          }
        }
      }
    }
    // this.events = new Set();
  }

  on(eventName: string, listener: Function) {
    if (this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, [
        ...this.eventListeners.get(eventName) || [],
        listener
      ]);
    } else {
      this.eventListeners.set(eventName, [listener]);
    }
  }
}
