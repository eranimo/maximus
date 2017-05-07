import { random } from 'lodash';


export default class Color {
  red: number;
  blue: number;
  green: number;
  alpha: number;

  constructor(red: number, blue: number, green: number, alpha: number = 1) {
    this.red = red;
    this.blue = blue;
    this.green = green;
    this.alpha = alpha;
  }

  setAlpha(opacity: number): Color {
    this.alpha = opacity;
    return this;
  }

  toRGBA(): string {
    return `rgba(${this.red}, ${this.blue}, ${this.green}, ${this.alpha})`;
  }

  static random(opacity: number = 1): Color {
    return new Color(random(0, 255), random(0, 255), random(0, 255), opacity);
  }
}
