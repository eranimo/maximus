import type { Component } from '../entityManager';
import { UIViewportText, UIWorldText } from '../components/ui';
import RenderSystem from './render';


// render UI components
export default class UISystem extends RenderSystem {
  static componentTypes = [
    UIViewportText,
    UIWorldText
  ];
}
