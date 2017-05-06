import { Component } from '../entityManager';
import {
  SCENE_CELLS_WIDTH,
  SCENE_CELLS_HEIGHT,
  MINIMAP_WIDTH,
  MINIMAP_HEIGHT,
} from '../constants';


export default class MinimapComponent extends Component {
  state: {
    pos: Point,
    color: string,
  };

  draw(ctx: CanvasRenderingContext2D) {
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
