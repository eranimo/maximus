// @flow
import { Component } from '../entityManager';


export default class EventTrigger extends Component {
  callbacks: Map<string, Array<Array<any>>>;

  static initialState = {
    type: 'world'
  }

  constructor() {
    super(...arguments);
    this.callbacks = new Map();
  }

  trigger(eventName: string, args: Array<any>) {
    this.callbacks.set(eventName, [
      ...this.callbacks.get(eventName) || [],
      args
    ]);
  }

  update() {
    for (const [eventName, argsList]: [string, Array<Array<any>>] of this.callbacks.entries()) {
      for (const args: Array<any> of argsList) {
        // $FlowFixMe
        if (this[eventName]) {
          // $FlowFixMe
          this[eventName](...args);
        }
      }
    }
    this.callbacks = new Map();
  }
}
