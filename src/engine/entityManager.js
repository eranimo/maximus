// @flow
import type { ComponentClass } from './component';
import Entity from './entity';
import type System from './system';
import type Component from './component';
import EventEmitter from 'eventemitter3';


export default class EntityManager extends EventEmitter {
  entities: Array<Entity>;
  componentInstances: Array<ComponentClass>;
  systems: { [string]: $Subtype<System> };
  resources: Object;

  constructor(systems: { [string]: $Subtype<System> }, resources: Object) {
    super();
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
}
