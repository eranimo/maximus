import { Component } from '../entityManager';
import {
  SCENE_CELLS_WIDTH,
  SCENE_CELLS_HEIGHT,
  MINIMAP_WIDTH,
  MINIMAP_HEIGHT,
  SCENE_WIDTH,
  SCENE_HEIGHT,
} from '../constants';
import type RenderComponent from './render';


export class MinimapPoint extends Component implements RenderComponent {
  state: {
    pos: Point,
    color: string,
  };

  draw(viewport: Viewport, ctx: CanvasRenderingContext2D) {
    const { color, pos: { x, y } } = this.state;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(
      0.5 + Math.round((x / SCENE_CELLS_WIDTH) * MINIMAP_WIDTH),
      0.5 + Math.round((y / SCENE_CELLS_HEIGHT) * MINIMAP_HEIGHT),
      1,
      1,
    );
    ctx.fill();
  }
}

export class MinimapBackdrop extends Component implements RenderComponent {
  draw(viewport: Viewport, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.rect(
      0,
      0,
      MINIMAP_WIDTH,
      MINIMAP_HEIGHT,
    );
    ctx.fill();
  }
}

export class MinimapFrame extends Component implements RenderComponent {
  draw(viewport: Viewport, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    const { width, height } = viewport.getViewportRealSize();
    ctx.rect(
      1.0 + Math.round((-viewport.offset.x / SCENE_WIDTH) * MINIMAP_WIDTH),
      1.0 + Math.round((-viewport.offset.y / SCENE_HEIGHT) * MINIMAP_HEIGHT),
      Math.round(MINIMAP_WIDTH * (width / SCENE_WIDTH)),
      Math.round(MINIMAP_HEIGHT * (height / SCENE_HEIGHT)),
    );
    ctx.stroke();
  }
}
