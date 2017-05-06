import RenderSystem from './render';
import Box from '../components/box';


export default class DisplaySystem extends RenderSystem {
  static componentTypes = [
    Box,
  ];

  update() {
    for (const comp: Box of this.getComponents()) {
      comp.update();
    }
  }

  draw() {
    this.getComponents().forEach((comp: Component) => {
      comp.draw(this.viewport, this.ctx);
    });
  }
}
