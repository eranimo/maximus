// @flow
import Component from '../engine/component';
import {
  SCENE_CELLS_WIDTH,
  SCENE_CELLS_HEIGHT,
  MINIMAP_WIDTH,
  MINIMAP_HEIGHT,
} from '../constants';
import Point from '../geometry/point';
import Color from '../utils/color';
import type { MapPosition } from './position';
import { VIEWPORT_MOVE } from '../events';


const POINT_SIZE = MINIMAP_WIDTH / SCENE_CELLS_WIDTH;
// renders a point on the minimap
export default class MinimapPoint extends Component {
  state: {
    position: Point,
    color: Color,
    isStatic: boolean,
  };
  cell: MapPosition;

  static initialState = {
    color: new Color(100, 100, 100),
  }

  static dependencies = {
    cell: 'MapPosition',
  };

  fillStyle: string;

  init() {
    this.fillStyle = this.state.color.toRGBA();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { position: { x, y } } = this.cell.state;

    const { bounds } = this.systems.minimap;
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(
      Math.round(bounds.position.x + (x / SCENE_CELLS_WIDTH) * MINIMAP_WIDTH),
      Math.round(bounds.position.y + (y / SCENE_CELLS_HEIGHT) * MINIMAP_HEIGHT),
      POINT_SIZE,
      POINT_SIZE,
    );
  }
}
