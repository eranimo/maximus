// @flow
import RenderSystem from './render';
import { Tile } from '../components/tile';
import { Avatar } from '../components/avatar';


// a system that displays all world entities
export default class DisplaySystem extends RenderSystem {
  static componentTypes = [
    Tile,
    Avatar,
  ];
}
