import type { Component } from '../entityManager';
import { UIViewportText, UIWorldText } from '../components/ui';
import RenderSystem from './render';


export default class UISystem extends RenderSystem {
  static componentTypes = [
    UIViewportText,
    UIWorldText
  ];
}
