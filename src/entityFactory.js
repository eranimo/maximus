import EntityManager, { Entity } from './entityManager';
import Point from './point';


export function makeBuilding(manager: EntityManager, pos: Point, name: ?string): Entity {
  return manager.addEntity({
    display: {
      pos,
      color: 'blue',
    },
    minimap: {
      pos,
      color: 'blue',
    }
  }, name);
}
