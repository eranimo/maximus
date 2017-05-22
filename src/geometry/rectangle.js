import Point from './point';


export default class Rectangle {
  position: Point;
  width: number;
  height: number;

  constructor(position: Point, width: number, height: number) {
    this.position = position;
    this.width = width;
    this.height = height;
  }

  get centroid(): Point {
    return new Point(
      (this.x1 + this.x2) / 2,
      (this.y1 + this.y2) / 2,
    );
  }

  get x1(): number {
    return this.position.x;
  }

  get y1(): number {
    return this.position.y;
  }

  get x2(): number {
    return this.position.x + this.width;
  }

  get y2(): number {
    return this.position.y + this.height;
  }

  containsPoint(point: Point): boolean {
    return this.x1 <= point.x &&
           this.y1 <= point.y &&
           this.x2 >= point.x &&
           this.y2 >= point.y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.rect(this.position.x, this.position.y, this.width, this.height);
  }
}
