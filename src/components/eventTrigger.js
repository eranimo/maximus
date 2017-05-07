import { Component } from '../entityManager';
import Rectangle from '../geometry/rectangle';


export default class EventTrigger extends Component {
  state: {
    bounds: Rectangle
  };
  callbacks: Map<string, Array<Array<any>>>;

  constructor() {
    super(...arguments);
    this.callbacks = new Map();
  }

  trigger(eventName: string, args: Array<any>) {
    this.callbacks.set(eventName, [
      ...this.callbacks.get(eventName) || [],
      [args]
    ]);
  }

  update() {
    for (const [eventName, argsList]: [string, Array<Array<any>>] of this.callbacks.entries()) {
      for (const args: Array<any> of argsList) {
        if (this[eventName]) {
          this[eventName](...args);
        }
      }
    }
    this.callbacks = new Map();
  }
}
