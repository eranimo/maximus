import { random, inRange, round } from 'lodash';


export default class Point {
  x: number;
  y: number;

  constructor(x: number | Object, y: number) {
    if (arguments.length === 2) {
      this.x = x;
      this.y = y;
    } else if (arguments.length === 1){
      this.x = x.x;
      this.y = x.y;
    }
  }

  static random(maxX: number, maxY: number): Point {
    return new Point(
      random(maxX),
      random(maxY),
    );
  }

  round(precision: number = 0): Point {
    return new Point(
      round(this.x, precision),
      round(this.y, precision),
    );
  }

  add(amount: number): Point {
    return new Point(
      this.x + amount,
      this.y + amount,
    );
  }

  divide(amount: number): Point {
    return new Point(
      this.x / amount,
      this.y / amount,
    );
  }

  multiply(amount: number): Point {
    return new Point(
      this.x * amount,
      this.y * amount,
    );
  }

  // is this point within range?
  within(point: Point, range: number): boolean {
    return inRange(this.x, point.x - range, point.x + range) &&
           inRange(this.y, point.y - range, point.y + range);
  }

  equals(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }

  distanceTo(point: Point): number {
    return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
  }
}
