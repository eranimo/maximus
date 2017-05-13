// @flow
import type { EntityType } from '../entityManager';
import Color from '../utils/color';
import Point from '../geometry/point';
import { Circle } from '../components/circle';
import { MinimapPoint } from '../components/minimap';
import { MapPosition } from '../components/position';
import { PersonTrigger } from '../components/person';
import Rectangle from '../geometry/rectangle';
import { CELL_SIZE } from '../constants';


const Person: EntityType = {
  name: 'Person',
  components: ({ position }: { position: Point }): any => ([
    new MapPosition({
      position,
      type: 'world',
      bounds: new Rectangle(position.multiply(CELL_SIZE), CELL_SIZE, CELL_SIZE)
    }),
    new PersonTrigger(),
    new Circle({
      color: new Color(255, 0, 0)
    }),
    new MinimapPoint(),
  ])
};

export default Person;
