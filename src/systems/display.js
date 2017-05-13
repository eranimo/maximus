// @flow
import RenderSystem from './render';
import { Box } from '../components/box';
import { Circle } from '../components/circle';


// a system that displays all world entities
export default class DisplaySystem extends RenderSystem {
  static componentTypes = [
    Box,
    Circle,
  ];
}
