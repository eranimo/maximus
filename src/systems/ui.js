// @flow
import { ViewportText, WorldText } from '../components/ui';
import RenderSystem from './render';


// render UI components
export default class UISystem extends RenderSystem {
  static componentTypes = [
    ViewportText,
    WorldText
  ];
}
