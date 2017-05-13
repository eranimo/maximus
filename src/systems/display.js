// @flow
import RenderSystem from './render';
import { Box } from '../components/box';
import { Avatar } from '../components/avatar';


// a system that displays all world entities
export default class DisplaySystem extends RenderSystem {
  static componentTypes = [
    Box,
    Avatar,
  ];
}
