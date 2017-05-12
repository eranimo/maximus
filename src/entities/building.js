// @flow
import type { EntityType } from '../entityManager';
import Rectangle from '../geometry/rectangle';
import Color from '../utils/color';
import { CELL_SIZE } from '../constants';
import Point from '../geometry/point';


const Building: EntityType = {
  name: 'Building',
  components: ({ position }: { position: Point }): Object => ({
    box: {
      pos: position,
      color: new Color(0, 0, 255),
      opacity: 1,
    },
    minimapPoint: {
      pos: position,
      color: 'blue',
    },
    worldText: {
      font: 'sans-serif',
      size: 7,
      color: '#C0C0C0',
      shadow: true,
      text: 'foobar',
      position: position,
    },
    boxTrigger: {
      type: 'world',
      bounds: new Rectangle(position.multiply(CELL_SIZE), CELL_SIZE, CELL_SIZE)
    }
  })
};

export default Building;
