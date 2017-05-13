import Point from './point';


export default class Circle {
  center: Point;

  constructor(x: ?number, y: ?number, radius: number) {
    this.center = new Point(x, y);
    if (!radius) {
      throw new Error('Radius is required for circle');
    }
    this.radius = radius;
  }

  static fromPoint(point: Point, radius: number): Circle {
    const avatar: Point = new Circle(null, null, radius);
    avatar.center = point;
    return avatar;
  }

  containsPoint(point: Point): boolean {
    const distance: number = this.center.distanceTo(point);
    return distance < this.radius;
  }
}
