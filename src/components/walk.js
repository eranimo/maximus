// @flow
import { inRange } from 'lodash';
import { Component } from '../entityManager';
import { CELL_SIZE } from '../constants';
import Point from '../geometry/point';
import type { MapPosition } from './position';

/*

Implements a walking behavior
requires MapPosition component

States:
  - walking: currently moving towards the first item in the queue
  - blocked: has queue items, but first item is unreachable
  - idle: no queue items

*/
export class Walk extends Component {
  queue: Array<Point>;
  destination: ?Point;
  systems: Object;
  pos: MapPosition;
  waitTime: number;
  walkSpeed: number;

  static dependencies = {
    pos: 'MapPosition',
  };

  init() {
    this.queue = [];
    this.waitTime = 10;
    this.walkSpeed = 1;
  }

  clear() {
    this.queue = [];
  }

  goTo(point: Point) {
    this.queue.push(point);
  }

  goToImmediately(point: Point) {
    this.queue = [point];
  }

  update() {
    const time = this.systems.time;
    const speed = time.speed;
    if (time.isPaused) {
      return;
    }

    // find a new destination
    if (this.queue.length > 0 && !this.destination) {
      this.destination = this.queue.shift();
    }

    const worldPosition = this.pos.state.position.multiply(CELL_SIZE);
    if (this.destination) {
      // move towards destination
      let diffX = this.destination.x - worldPosition.x;
      let diffY = this.destination.y - worldPosition.y;
      diffX = diffX / Math.abs(diffX);
      diffY = diffY / Math.abs(diffY);
      if (diffX !== 0 && !isNaN(diffX)) {
        const increaseX = (diffX * this.walkSpeed) * speed;
        if (this.destination &&
            ((worldPosition.x < this.destination.x && worldPosition.x + increaseX > this.destination.x) ||
             (worldPosition.x > this.destination.x && worldPosition.x + increaseX < this.destination.x))) {
          worldPosition.x = this.destination.x;
        } else {
          worldPosition.x += increaseX;
        }
      }
      if (diffY !== 0 && !isNaN(diffY)) {
        const increaseY = (diffY * this.walkSpeed) * speed;
        if (this.destination &&
            ((worldPosition.y < this.destination.y && worldPosition.y + increaseY > this.destination.y) ||
             (worldPosition.y > this.destination.y && worldPosition.y + increaseY < this.destination.y))) {
          worldPosition.y = this.destination.y;
        } else {
          worldPosition.y += increaseY;
        }
      }
      this.pos.state.position = worldPosition.divide(CELL_SIZE);

      // if we're at the destination, remove it
      // console.log(diffX, diffY, worldPosition, this.destination);
      if (this.destination &&
          inRange(worldPosition.x, this.destination.x - 1, this.destination.x + 1) &&
          inRange(worldPosition.y, this.destination.y - 1, this.destination.y + 1)) {
        if (this.destination) {
          this.pos.state.position = this.destination.divide(CELL_SIZE);
          console.log('destination reached!');
          this.destination = null;
        }
        this.waitUntilTime = time.time + this.waitTime * 1000;

        this.goTo(Point.random(100, 100).multiply(CELL_SIZE));
      }
    }
  }
}
