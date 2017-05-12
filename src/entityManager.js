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

let currentID = 0;

export class Component {
  id: number;
  entity: Entity;
  state: Object;

  static initialState = {};

  constructor(options: Object = {}) {
    this.state = Object.assign({}, this.constructor.initialState, options);
    this.id = currentID;
    currentID++;
  }
  init() {}
  update() {}
  sendEvent(event: GameEvent) {
    this.entity.manager.emitEvent(event);
  }
  on(event: GameEvent) {} // eslint-disable-line
}

export class Entity {
  name: ?string;
  manager: EntityManager;
  components: Array<ComponentClass>;

  constructor(name: ?string) {
    this.name = name;
    this.components = [];
  }

  addComponent(instance: ComponentClass) {
    this.components.push(instance);
  }

  getComponents(identifier: string): Array<ComponentClass> {
    return this.components.filter((comp: Component): boolean => comp.constructor.name === identifier);
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

  constructor(manager: EntityManager) {
    this.manager = manager;

    console.log(
      `Registered system ${this.constructor.name} with ${this.constructor.componentTypes.length} components\n`,
      this.constructor.componentTypes.map((c: Class<ComponentClass>): string => {
        return `\t- ${c.name}`;
      }).join('\n')
    );
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

  update() {}
}

export type ComponentClass = $Subtype<Component>;

export default class EntityManager {
  entities: Array<Entity>;
  componentInstances: Array<ComponentClass>;
  events: Set<GameEvent>;
  eventListeners: Map<string, Array<Function>>;

  constructor() {
    this.componentInstances = [];
    this.entities = [];
    this.events = new Set();
    this.eventListeners = new Map();
  }

  addEntity(entityType: Object, options: Object = {}): Entity {
    const entity: Entity = new Entity(entityType.name);
    const components = entityType.components(options);
    this.componentInstances.push(...components);
    entity.components = components;
    for (const instance: $Subtype<Component> of components) {
      instance.entity = entity;
      if (instance.constructor.dependencies) {
        for (const [key, depName]: [string, any] of Object.entries(instance.constructor.dependencies)) {
          const foundComponents: Array<ComponentClass> = entity.getComponents(depName);
          if (foundComponents.length === 0) {
            throw new Error(`Missing required component ${depName}`);
          } else if (foundComponents.length === 1) {
            instance[key] = foundComponents[0];
          } else {
            instance[key] = foundComponents;
          }
        }
      }
      instance.init();
    }
    entity.manager = this;
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
    // for (const entity of this.entities) {
    //   for (const [identifier, instance]: [string, Component] of entity.components.entries()) {
    //     instance.update();
    //   }
    // }
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
