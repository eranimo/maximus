// @flow
import type { ComponentClass } from './component';
import Entity from './entity';
import type System from './system';
import type Component from './component';


export type GameEvent = {
  name: string,
  value: Object,
};

export default class EntityManager {
  entities: Array<Entity>;
  componentInstances: Array<ComponentClass>;
  events: Set<GameEvent>;
  systems: { [string]: $Subtype<System> };
  eventListeners: Map<string, Array<Function>>;
  resources: Object;

  constructor(systems: { [string]: $Subtype<System> }, resources: Object) {
    this.componentInstances = [];
    this.entities = [];
    this.systems = systems;
    this.resources = resources;
    console.log(this.systems);
    for (const system: any of Object.values(this.systems)) {
      system.manager = this;
      system.init();
      system.refetch();
    }
    this.events = new Set();
    this.eventListeners = new Map();
  }

  refresh() {
    for (const system: any of Object.values(this.systems)) {
      system.refetch();
    }
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
