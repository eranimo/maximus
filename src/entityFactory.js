import EntityManager, { Entity } from './entityManager';
import Point from './point';

export function makeMinimap(manager: EntityManager): Entity {
  return manager.addEntity({
    minimapFrame: {},
    minimapBackdrop: {},
  }, 'minimap');
}

export function makeBuilding(manager: EntityManager, pos: Point, name: ?string): Entity {
  return manager.addEntity({
    display: {
      pos,
      color: 'blue',
    },
    minimapPoint: {
      pos,
      color: 'blue',
    }
  }, name);
}
