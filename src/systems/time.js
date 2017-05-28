// @flow
import System from '../engine/system';
import type EntityManager from '../engine/entityManager';


// base class for any System that handles RenderComponents
export default class TimeSystem extends System {
  tickNumber: number;
  time: number;
  speed: number;
  prevSpeed: number;
  isPaused: boolean;

  constructor() {
    super();
    this.tickNumber = 1;
    this.time = 1;
    this.speed = 1;
    this.prevSpeed = 1;
  }

  get timeSeconds(): number {
    return this.time / 1000;
  }

  update() {
    this.time += this.speed;
    this.tickNumber++;
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
