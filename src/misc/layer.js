// @flow
import {
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
} from '../constants';


export default class Layer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(name: string, zIndex: number = 1, smooth = true) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', `${VIEWPORT_WIDTH}px`);
    canvas.setAttribute('height', `${VIEWPORT_HEIGHT}px`);
    canvas.setAttribute('id', name);
    canvas.style.zIndex = `${zIndex}`;
    canvas.addEventListener('contextmenu', (event: Event): boolean => {
      event.preventDefault();
      return false;
    }, false);

    const ctx = (canvas: HTMLCanvasElement).getContext('2d');
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }

    if (smooth) {
      ctx.imageSmoothingEnabled = false;
      ctx.translate(0.5, 0.5);
    }

    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      canvas.setAttribute('width', `${this.width}px`);
      canvas.setAttribute('height', `${this.height}px`);
    });

    this.canvas = canvas;
    this.ctx = ctx;

    this.width = VIEWPORT_WIDTH;
    this.height = VIEWPORT_HEIGHT;

    // $FlowFixMe
    document.body.appendChild(canvas);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}
