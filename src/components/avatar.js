// @flow
import Component from '../engine/component';
import Point from '../geometry/point';
import { CELL_SIZE } from '../constants';
import Color from '../utils/color';
import type { MapPosition } from './position';


export class Avatar extends Component {
  state: {
    color: Color,
    isHover: boolean,
  };
  pos: MapPosition;
  systems: Object;

  static initialState = {
    color: new Color(0, 0, 255),
    isHover: false,
  }
  static dependencies = {
    pos: 'MapPosition',
  }

  get radius(): number {
    return this.systems.viewport.toZoom(CELL_SIZE / 2);
  }

  draw() {
    const { ctx } = this.systems.region.mainLayer;
    const { color, isHover } = this.state;
    const opacity = isHover ? 0.5 : 1;
    const { position } = this.pos.state;
    ctx.fillStyle = color.setAlpha(opacity).toRGBA(opacity);
    ctx.lineWidth = 1;

    const intersect = this.systems.viewport.calculateBounds(
      position.multiply(CELL_SIZE),
      CELL_SIZE,
      CELL_SIZE,
    );
    if (intersect) {
      ctx.beginPath();
      ctx.arc(
        intersect.topLeft.x + this.radius,
        intersect.topLeft.y + this.radius,
        this.radius * 0.75,
        0,
        2 * Math.PI,
      );
      ctx.fill();
      ctx.stroke();
    }
  }

  update() {
    // this.systems.viewport.jump(this.pos.state.position.multiply(CELL_SIZE).add(this.radius));
  }
}
