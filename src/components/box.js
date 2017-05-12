// @flow
import { Component } from '../entityManager';
import Point from '../geometry/point';
import Viewport from '../viewport';
import { CELL_SIZE } from '../constants';
import EventTrigger from './eventTrigger';
import Color from '../utils/color';
import { GridCell } from './grid';


export class Box extends Component {
  state: {
    position: Point,
    color: Color,
    opacity: number,
  };
  cell: GridCell;

  static initialState = {
    color: new Color(0, 0, 255),
    opacity: 1,
  }
  static dependencies = {
    cell: 'GridCell',
  }

  draw(viewport: Viewport, ctx: CanvasRenderingContext2D) {
    const { color, opacity } = this.state;
    const { position: { x, y } } = this.cell.state;
    ctx.fillStyle = color.setAlpha(opacity).toRGBA(opacity);

    const intersect = this.calculateBounds(
      viewport,
      new Point(x * CELL_SIZE, y * CELL_SIZE),
      CELL_SIZE,
      CELL_SIZE,
    );
    if (intersect) {
      ctx.fillRect(
        intersect.topLeft.x,
        intersect.topLeft.y,
        intersect.width,
        intersect.height,
      );
    }
  }

  calculateBounds(viewport: Viewport, loc: Point, width: number, height: number): ?Object {
    const loc2 = new Point(loc.x + width, loc.y + height);
    const loc3 = new Point(loc.x, loc.y + height);
    const loc4 = new Point(loc.x + width, loc.y);
    if (
      viewport.isInViewport(viewport.worldToViewport(loc)) ||
      viewport.isInViewport(viewport.worldToViewport(loc2)) ||
      viewport.isInViewport(viewport.worldToViewport(loc3)) ||
      viewport.isInViewport(viewport.worldToViewport(loc4))
    ) {
      const topLeft = viewport.worldToViewport(loc);
      const bottomRight = viewport.worldToViewport(loc2);
      const newWidth = bottomRight.x - topLeft.x;
      const newHeight = bottomRight.y - topLeft.y;
      return { topLeft, width: newWidth, height: newHeight };
    }
    return null;
  }
}


export class BoxTrigger extends EventTrigger {
  static dependencies = {
    box: 'Box',
  }
  box: Box;

  onMouseEnter() {
    this.box.state.opacity = 0.5;
  }

  onMouseLeave() {
    this.box.state.opacity = 1;
  }

  onMouseUp() {
    this.box.state.color = Color.random();
  }
}
