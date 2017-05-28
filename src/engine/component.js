// @flow
import type System from './system';
import type Entity from './entity';
import EventEmitter from 'eventemitter3';


let currentComponentID = 0;

export type ComponentClass = $Subtype<Component>;

export default class Component extends EventEmitter {
  id: number;
  entity: Entity;
  state: Object;
  waitUntilTime: ?number;
  shouldDraw: boolean;

  static initialState = {};

  constructor(options: Object = {}) {
    super();
    this.state = Object.assign({}, this.constructor.initialState, options);
    this.id = currentComponentID;
    this.shouldDraw = true;
    currentComponentID++;
  }
  init() {}
  update() {}

  get systems(): { [string]: $Subtype<System> } {
    return this.entity.manager.systems;
  }

  get resources(): Object {
    return this.entity.manager.resources;
  }
}
