// @flow
import { Component } from '../entityManager';
import {
  SCENE_CELLS_WIDTH,
  SCENE_CELLS_HEIGHT,
  MINIMAP_WIDTH,
  MINIMAP_HEIGHT,
  SCENE_WIDTH,
  SCENE_HEIGHT,
} from '../constants';
import EventTrigger from './eventTrigger';
import Rectangle from '../geometry/rectangle';
import Point from '../geometry/point';
import { VIEWPORT_JUMP } from '../events';
import Color from '../utils/color';
import type { MapPosition } from './position';


// renders a point on the minimap
export class MinimapPoint extends Component {
  state: {
    position: Point,
    color: Color
  };
  cell: MapPosition;

  static initialState = {
    color: new Color(100, 100, 100),
  }

  static dependencies = {
    cell: 'MapPosition',
  };

  draw() {
    const { ctx } = this.systems.minimap.layer;
    const { position: { x, y } } = this.cell.state;
    const { position } = this.systems.minimap.bounds;

    ctx.fillStyle = this.state.color.toRGBA();
    ctx.fillRect(
      0.5 + position.x + Math.round((x / SCENE_CELLS_WIDTH) * MINIMAP_WIDTH),
      0.5 + position.y + Math.round((y / SCENE_CELLS_HEIGHT) * MINIMAP_HEIGHT),
      1,
      1,
    );
  }
}
