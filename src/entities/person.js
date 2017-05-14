// @flow
import type { EntityType } from '../entityManager';
import Color from '../utils/color';
import Point from '../geometry/point';
import { Avatar } from '../components/avatar';
import { MinimapPoint } from '../components/minimap';
import { MapPosition } from '../components/position';
import { PersonTrigger } from '../components/person';
import { Walk } from '../components/walk';


const Person: EntityType = {
  name: 'Person',
  components: ({ position }: { position: Point }): any => ([
    new MapPosition({
      position,
      positionType: 'circle',
    }),
    new PersonTrigger(),
    new Avatar({
      color: new Color(255, 0, 0)
    }),
    new MinimapPoint(),
    new Walk(),
  ])
};

export default Person;
