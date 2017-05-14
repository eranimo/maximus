// @flow
import { Component } from '../entityManager';
import Point from '../geometry/point';
import Viewport from '../viewport';
import { CELL_SIZE } from '../constants';
import Color from '../utils/color';
import type { MapPosition } from './position';


export class Avatar extends Component {
  state: {
    color: Color,
    opacity: number,
  };
  pos: MapPosition;
  systems: Object;

  static initialState = {
    color: new Color(0, 0, 255),
    opacity: 1,
  }
  static dependencies = {
    pos: 'MapPosition',
  }

  draw(viewport: Viewport, ctx: CanvasRenderingContext2D) {
    const { color, opacity } = this.state;
    const { position: { x, y } } = this.pos.state;
    ctx.fillStyle = color.setAlpha(opacity).toRGBA(opacity);
    ctx.lineWidth = 1;

    const intersect = viewport.calculateBounds(
      new Point(x * CELL_SIZE, y * CELL_SIZE),
      CELL_SIZE,
      CELL_SIZE,
    );
    if (intersect) {
      ctx.beginPath();
      const half = viewport.toZoom(CELL_SIZE / 2);
      ctx.arc(
        intersect.topLeft.x + half,
        intersect.topLeft.y + half,
        half * 0.75,
        0,
        2 * Math.PI,
      );
      ctx.fill();
      ctx.stroke();
    }
  }

  update() {
    const speed = this.systems.TimeSystem.speed;
    // this.pos.state.position.x += 0.01 * speed;
  }
}
