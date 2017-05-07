import { Component } from '../entityManager';
import type EventTrigger from './eventTrigger';

export class SelectLogic extends Component {
  state: {
    selectedID: number,
  };

  init() {
    this.state.selectedID = null;
  }

  deselect() {
    this.state.selectedID = null;
  }
}

export default class Selectable extends EventTrigger {
  
}
