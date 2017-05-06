import type { Component } from '../entityManager';
import { MinimapPoint, MinimapBackdrop, MinimapFrame } from '../components/minimap';
import RenderSystem from './render';


export default class UISystem extends RenderSystem {
  static componentTypes = [
    MinimapBackdrop,
    MinimapFrame,
    MinimapPoint,
  ];

  update() {
    for (const comp: $Subtype<Component> of this.getComponents()) {
      comp.update();
    }
  }

  draw() {
    this.getComponents().forEach((comp: Component) => {
      comp.draw(this.viewport, this.ctx);
    });
  }
}
