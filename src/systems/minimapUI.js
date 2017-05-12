// @flow
import { MinimapPoint, MinimapBackdrop, MinimapFrame } from '../components/minimap';
import RenderSystem from './render';


// handles rendering minimap components
export default class MinimapUISystem extends RenderSystem {
  static componentTypes = [
    MinimapBackdrop,
    MinimapFrame,
    MinimapPoint,
  ];
}
