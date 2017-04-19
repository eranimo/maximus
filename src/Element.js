// @flow
import { Graphics } from 'pixi.js';
import { BOX_SIZE } from './constants';


export default class Element {
  g: Graphics;

  constructor() {
    this.g = new Graphics();
    this.draw();
  }

  draw() {
    throw new Error('Not Implemented');
  }

  update() {}
}
