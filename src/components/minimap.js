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
import type Viewport from '../viewport';
import type { Box } from '../components/Box';
import { GridCell } from './grid';


// renders a point on the minimap
export class MinimapPoint extends Component {
  state: {
    position: Point,
  };
  box: Box;
  cell: GridCell;
  static dependencies = {
    box: 'Box',
    cell: 'GridCell',
  };

  draw(viewport: Viewport, ctx: CanvasRenderingContext2D) {
    const { position: { x, y } } = this.cell.state;
    const logic: ?MinimapLogic = this.entity.manager.getComponents('MinimapLogic')[0];
    if (!logic) {
      throw new Error('Could not find MinimapLogic component');
    }
    const { bounds } = logic.state;

    ctx.beginPath();
    ctx.fillStyle = this.box.state.color.toRGBA();
    ctx.fillRect(
      0.5 + bounds.position.x + Math.round((x / SCENE_CELLS_WIDTH) * MINIMAP_WIDTH),
      0.5 + bounds.position.y + Math.round((y / SCENE_CELLS_HEIGHT) * MINIMAP_HEIGHT),
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

  onMouseDown(point: Point) {
    this.state.isPanning = true;
    window.canvas.style.cursor = 'move';
    const { bounds } = this.state;
    const worldPoint = new Point({
      x: Math.round(((point.x - bounds.position.x) / MINIMAP_WIDTH) * SCENE_WIDTH),
      y: Math.round(((point.y - bounds.position.y) / MINIMAP_HEIGHT) * SCENE_HEIGHT),
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
    const { bounds } = this.state;
    const worldPoint = new Point({
      x: Math.round(((point.x - bounds.position.x) / MINIMAP_WIDTH) * SCENE_WIDTH),
      y: Math.round(((point.y - bounds.position.y) / MINIMAP_HEIGHT) * SCENE_HEIGHT),
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
  draw(viewport: Viewport, ctx: CanvasRenderingContext2D) {
    const logic: ?MinimapLogic = this.entity.manager.getComponents('MinimapLogic')[0];
    if (!logic) {
      throw new Error('Could not find MinimapLogic component');
    }
    const { bounds } = logic.state;
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.rect(
      0 + Math.round(bounds.position.x),
      0 + Math.round(bounds.position.y),
      MINIMAP_WIDTH,
      MINIMAP_HEIGHT,
    );
    ctx.stroke();
    ctx.fill();
  }
}

// minimap frame that represent's the viewport's current view
export class MinimapFrame extends Component {
  draw(viewport: Viewport, ctx: CanvasRenderingContext2D) {
    const logic: ?MinimapLogic = this.entity.manager.getComponents('MinimapLogic')[0];
    if (!logic) {
      throw new Error('Could not find MinimapLogic component');
    }
    const { bounds } = logic.state;

    ctx.save();
    bounds.draw(ctx);
    ctx.clip();

    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    const { width, height } = viewport.getViewportRealSize();
    ctx.rect(
      bounds.position.x + 1.0 + Math.round((-viewport.offset.x / SCENE_WIDTH) * MINIMAP_WIDTH),
      bounds.position.y + 1.0 + Math.round((-viewport.offset.y / SCENE_HEIGHT) * MINIMAP_HEIGHT),
      Math.round(MINIMAP_WIDTH * (width / SCENE_WIDTH)),
      Math.round(MINIMAP_HEIGHT * (height / SCENE_HEIGHT)),
    );
    ctx.stroke();
    ctx.restore();
  }
}
