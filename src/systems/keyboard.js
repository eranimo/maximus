// @flow
import { System } from '../entityManager';

const keyCodes = {
  shift: 16,
  space: 32,
  enter: 13,
  escape: 27,
};

export default class KeyboardSystem extends System {
  keysPressed: { [number]: boolean };

  constructor() {
    super();
    this.keysPressed = {};

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      this.keysPressed[event.keyCode] = false;
    });
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      this.keysPressed[event.keyCode] = true;
    });
  }

  isKeyPressed(key: string): boolean {
    if (!(key in keyCodes)) {
      throw new Error(`Key ${key} not recognized keycode`);
    }
    return this.isCodePressed(keyCodes[key]);
  }

  isCodePressed(keyCode: number): boolean {
    return this.keysPressed[keyCode] === true;
  }
}
