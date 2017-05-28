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
    color: Color,
    opacity: number,
  };
  cell: MapPosition;

  static initialState = {
    sprite: new Color(0, 0, 255),
    opacity: 1,
  }
  static dependencies = {
    cell: 'MapPosition',
  }

  draw() {
    const { ctx } = this.systems.region;
    const { sprite } = this.state;
    const { position: { x, y } } = this.cell.state;

    const intersect = this.systems.viewport.calculateBounds(
      new Point(x * CELL_SIZE, y * CELL_SIZE),
      CELL_SIZE,
      CELL_SIZE,
    );
    if (intersect) {
      const image = this.resources.sprites[sprite].image;
      ctx.drawImage(
        image,
        intersect.topLeft.x,
        intersect.topLeft.y,
        intersect.width,
        intersect.height,
      );
      // ctx.fillRect(
      //   intersect.topLeft.x,
      //   intersect.topLeft.y,
      //   intersect.width,
      //   intersect.height,
      // );
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

  onMouseEnter() {
    this.tile.state.opacity = 0.5;
  }

  onMouseLeave() {
    this.tile.state.opacity = 1;
  }

  onMouseUp() {
    // this.tile.state.color = Color.random();
    this.systems.selection.toggle(this.entity);
  }
}
