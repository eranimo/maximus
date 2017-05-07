import RenderSystem from './render';
import Box from '../components/box';


export default class DisplaySystem extends RenderSystem {
  static componentTypes = [
    Box,
  ];
}
