export default class Point {
  constructor(x, y) {
    if (arguments.length === 2 ) {
      this.x = x;
      this.y = y;
    } else if (arguments.length === 1){
      this.x = x.x;
      this.y = x.y;
    }
  }
}
