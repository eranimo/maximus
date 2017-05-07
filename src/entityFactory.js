import EntityManager, { Entity } from './entityManager';
import Rectangle from './geometry/rectangle';
import Point from './geometry/point';
import { CELL_SIZE } from './constants';
import Color from './color';


export function makeMinimap(manager: EntityManager): Entity {
  return manager.addEntity({
    minimapFrame: {},
    minimapBackdrop: {},
  }, 'minimap');
}

export function makeBuilding(manager: EntityManager, pos: Point, name: ?string): Entity {
  return manager.addEntity({
    box: {
      pos,
      color: new Color(0, 0, 255),
      opacity: 1,
    },
    minimapPoint: {
      pos,
      color: 'blue',
    },
    worldText: {
      font: 'sans-serif',
      size: 7,
      color: '#C0C0C0',
      shadow: true,
      text: 'foobar',
      position: pos,
    },
    eventTrigger: {
      bounds: new Rectangle(pos.multiply(CELL_SIZE), CELL_SIZE, CELL_SIZE)
    }
  }, name);
}
