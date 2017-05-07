import { Component } from '../entityManager';
import {
  SCENE_CELLS_WIDTH,
  SCENE_CELLS_HEIGHT,
  MINIMAP_WIDTH,
  MINIMAP_HEIGHT,
  SCENE_WIDTH,
  SCENE_HEIGHT,
} from '../constants';
import type RenderComponent from './render';
import EventTrigger from './eventTrigger';
import Rectangle from '../geometry/rectangle';
import Point from '../geometry/point';


// renders a point on the minimap
export class MinimapPoint extends Component implements RenderComponent {
  state: {
    pos: Point,
    color: string,
  };

  draw(viewport: Viewport, ctx: CanvasRenderingContext2D) {
    const { color, pos: { x, y } } = this.state;
    const logic: ?MinimapLogic = this.entity.manager.getComponents('minimapLogic')[0];
    const { bounds } = logic.state;

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(
      bounds.position.x + Math.round((x / SCENE_CELLS_WIDTH) * MINIMAP_WIDTH),
      bounds.position.y + Math.round((y / SCENE_CELLS_HEIGHT) * MINIMAP_HEIGHT),
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

  init() {
    this.state.isPanning = false;
  }

  onMouseMove() {
    console.log('mouse move!');
  }

}

// background of the minimap
export class MinimapBackdrop extends Component implements RenderComponent {
  draw(viewport: Viewport, ctx: CanvasRenderingContext2D) {
    const logic: ?MinimapLogic = this.entity.manager.getComponents('minimapLogic')[0];
    const { bounds } = logic.state;
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.rect(
      bounds.position.x + 0,
      bounds.position.y + 0,
      MINIMAP_WIDTH,
      MINIMAP_HEIGHT,
    );
    ctx.fill();
  }
}

// minimap frame that represent's the viewport's current view
export class MinimapFrame extends Component implements RenderComponent {
  draw(viewport: Viewport, ctx: CanvasRenderingContext2D) {
    const logic: ?MinimapLogic = this.entity.manager.getComponents('minimapLogic')[0];
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
