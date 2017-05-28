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
  logic: MinimapLogic;

  static initialState = {
    color: new Color(100, 100, 100),
  }

  static dependencies = {
    cell: 'MapPosition',
  };
  draw() {
    const { ctx } = this.systems.region.mainLayer;
    const { position: { x, y } } = this.cell.state;
    if (!this.logic) {
      const logic: ?MinimapLogic = this.entity.manager.getComponents('MinimapLogic')[0];
      if (!logic) {
        throw new Error('Could not find MinimapLogic component');
      }
      this.logic = logic;
    }

    ctx.beginPath();
    ctx.fillStyle = this.state.color.toRGBA();
    ctx.fillRect(
      0.5 + this.logic.bounds.position.x + Math.round((x / SCENE_CELLS_WIDTH) * MINIMAP_WIDTH),
      0.5 + this.logic.bounds.position.y + Math.round((y / SCENE_CELLS_HEIGHT) * MINIMAP_HEIGHT),
      1,
      1,
    );
    ctx.fill();
  }
}

export class MinimapLogic extends EventTrigger {
  state: {
    isPanning: boolean,
    bounds: Rectangle
  };

  static eventType = 'viewport';
  get bounds(): Rectangle {
    return new Rectangle(
      new Point(
        window.innerWidth - MINIMAP_WIDTH,
        window.innerHeight - MINIMAP_HEIGHT,
      ),
      MINIMAP_WIDTH + 2,
      MINIMAP_HEIGHT + 2
    );
  }

  onMouseDown(point: Point) {
    this.state.isPanning = true;
    window.canvas.style.cursor = 'move';
    const worldPoint = new Point({
      x: Math.round(((point.x - this.bounds.position.x) / MINIMAP_WIDTH) * SCENE_WIDTH),
      y: Math.round(((point.y - this.bounds.position.y) / MINIMAP_HEIGHT) * SCENE_HEIGHT),
    });
    this.sendEvent({
      name: VIEWPORT_JUMP,
      value: {
        point: worldPoint
      }
    });
  }

  onMouseLeave() {
    this.state.isPanning = false;
    window.canvas.style.cursor = 'crosshair';
  }

  onMouseUp() {
    this.state.isPanning = false;
    window.canvas.style.cursor = 'crosshair';
  }

  onMouseMove(point: Point) {
    const worldPoint = new Point({
      x: Math.round(((point.x - this.bounds.position.x) / MINIMAP_WIDTH) * SCENE_WIDTH),
      y: Math.round(((point.y - this.bounds.position.y) / MINIMAP_HEIGHT) * SCENE_HEIGHT),
    });
    if (this.state.isPanning) {
      this.sendEvent({
        name: VIEWPORT_JUMP,
        value: {
          point: worldPoint
        }
      });
    }
  }

}

// background of the minimap
export class MinimapBackdrop extends Component {
  logic: MinimapLogic;

  draw() {
    const { ctx } = this.systems.region.mainLayer;
    if (!this.logic) {
      const logic: ?MinimapLogic = this.entity.manager.getComponents('MinimapLogic')[0];
      if (!logic) {
        throw new Error('Could not find MinimapLogic component');
      }
      this.logic = logic;
    }
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.rect(
      0 + Math.round(this.logic.bounds.position.x),
      0 + Math.round(this.logic.bounds.position.y),
      MINIMAP_WIDTH,
      MINIMAP_HEIGHT,
    );
    ctx.stroke();
    ctx.fill();
  }
}

// minimap frame that represent's the viewport's current view
export class MinimapFrame extends Component {
  logic: MinimapLogic;

  draw() {
    const { ctx } = this.systems.region.mainLayer;
    if (!this.logic) {
      const logic: ?MinimapLogic = this.entity.manager.getComponents('MinimapLogic')[0];
      if (!logic) {
        throw new Error('Could not find MinimapLogic component');
      }
      this.logic = logic;
    }

    ctx.save();
    this.logic.bounds.draw(ctx);
    ctx.clip();

    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    const { width, height } = this.systems.viewport.getViewportRealSize();
    ctx.rect(
      this.logic.bounds.position.x + 1.0 + Math.round((-this.systems.viewport.offset.x / SCENE_WIDTH) * MINIMAP_WIDTH),
      this.logic.bounds.position.y + 1.0 + Math.round((-this.systems.viewport.offset.y / SCENE_HEIGHT) * MINIMAP_HEIGHT),
      Math.round(MINIMAP_WIDTH * (width / SCENE_WIDTH)),
      Math.round(MINIMAP_HEIGHT * (height / SCENE_HEIGHT)),
    );
    ctx.stroke();
    ctx.restore();
  }
}
