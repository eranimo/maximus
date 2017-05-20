import { Component } from '../entityManager';
import Point from '../geometry/point';
import type RenderComponent from './render';
import { CELL_SIZE } from '../constants';


// text rendered onto the UI space
export class ViewportText extends Component implements RenderComponent {
  state: {
    position: Point,
    text: string,
    font: string,
    color: string,
  };

  draw(ctx: CanvasRenderingContext2D) {
    const { position: { x, y}, text, color, font } = this.state;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }
}

// text rendered onto the world space (inside the viewport)
export class WorldText extends Component implements RenderComponent {
  state: {
    position: Point,
    text: string,
    font: string,
    size: number,
    color: string,
    shadow: boolean,
  };

  draw() {
    const ctx = this.systems.region.ctx;
    const { position, text, color, font, size } = this.state;
    const { x, y } = this.systems.viewport.worldToViewport(
      position.multiply(CELL_SIZE).add(CELL_SIZE / 2)
    );
    const fontSize = this.systems.viewport.toZoom(size);
    ctx.save();
    ctx.font = `${fontSize}px ${font}`;
    ctx.textAlign = 'center';
    if (this.state.shadow) {
      ctx.fillStyle = 'black';
      ctx.fillText(text, x + 1, y + 1);
    }
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}
