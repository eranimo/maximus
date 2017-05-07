import type { Component } from '../entityManager';
import { MinimapPoint, MinimapBackdrop, MinimapFrame } from '../components/minimap';
import RenderSystem from './render';


export default class MinimapUISystem extends RenderSystem {
  static componentTypes = [
    MinimapBackdrop,
    MinimapFrame,
    MinimapPoint,
  ];
}
