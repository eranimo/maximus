// @flow
import { Component } from '../entityManager';
import Point from '../geometry/point';
import Rectangle from '../geometry/rectangle';
import { CELL_SIZE } from '../constants';
import EventTrigger from './eventTrigger';
import Color from '../utils/color';
import type { MapPosition } from './position';


export class Tile extends Component {
  state: {
    spritemap: string,
    row: number,
    col: number,
  };
  cell: MapPosition;
  position: Point;

  static initialState = {
    sprite: new Color(0, 0, 255),
    opacity: 1,
  }
  static dependencies = {
    cell: 'MapPosition',
  }

  init() {
    const { position: { x, y } } = this.cell.state;
    this.position = new Point(x * CELL_SIZE, y * CELL_SIZE);
  }

  draw() {
    const { ctx } = this.systems.region.terrainLayer;
    const { spritemap, row, col } = this.state;
    const { image, size } = this.resources.spritemaps[spritemap];

    const intersect = this.systems.viewport.calculateBounds(
      this.position,
      CELL_SIZE,
      CELL_SIZE,
    );
    if (intersect) {
      ctx.drawImage(
        image,
        (col - 1) * size,
        (row - 1) * size,
        size,
        size,
        intersect.topLeft.x,
        intersect.topLeft.y,
        intersect.width,
        intersect.height,
      );
    }
  }
}


export class BoxTrigger extends EventTrigger {
  static dependencies = {
    pos: 'MapPosition',
    tile: 'Tile'
  }
  pos: MapPosition;
  tile: Tile;

  get bounds(): Rectangle {
    return new Rectangle(
      this.pos.state.position.multiply(CELL_SIZE),
      CELL_SIZE,
      CELL_SIZE
    );
  }

  // onMouseEnter() {
  //   this.tile.state.opacity = 0.5;
  // }
  //
  // onMouseLeave() {
  //   this.tile.state.opacity = 1;
  // }

  onMouseUp() {
    // this.tile.state.color = Color.random();
    this.systems.selection.toggle(this.entity);
  }
}
