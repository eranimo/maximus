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

    Object.freeze(this);
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
}
