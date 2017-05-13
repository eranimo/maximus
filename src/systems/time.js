// @flow
import { System } from '../entityManager';
import type EntityManager from '../entityManager';


// base class for any System that handles RenderComponents
export default class TimeSystem extends System {
  tickNumber: number;
  time: number;
  speed: number;
  prevSpeed: number;
  isPaused: boolean;

  constructor(manager: EntityManager) {
    super(manager);
    this.tickNumber = 1;
    this.time = 1;
    this.speed = 1;
    this.prevSpeed = 1;
  }

  pause() {
    this.isPaused = true;
    this.prevSpeed = this.speed;
    this.speed = 0;
  }

  play() {
    this.isPaused = false;
    this.speed = this.prevSpeed;
    this.prevSpeed = 1;
  }
}
