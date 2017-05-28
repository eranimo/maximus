// @flow
import type System from './system';
import type Entity from './entity';
import type { GameEvent } from './entityManager';


let currentComponentID = 0;

export type ComponentClass = $Subtype<Component>;

export default class Component {
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

  get resources(): Object {
    return this.entity.manager.resources;
  }
}
