// @flow
import type { EntityType } from '../entityManager';
import Rectangle from '../geometry/rectangle';
import Color from '../utils/color';
import { CELL_SIZE } from '../constants';
import Point from '../geometry/point';
import { Box, BoxTrigger } from '../components/box';
import { MinimapPoint } from '../components/minimap';
import { WorldText } from '../components/ui';
import { GridCell } from '../components/gridCell';


const Building: EntityType = {
  name: 'Building',
  components: ({ position }: { position: Point }): any => {
    const bounds = new Rectangle(position.multiply(CELL_SIZE), CELL_SIZE, CELL_SIZE);
    return [
      new GridCell({
        position,
        weight: 0,
        type: 'world',
        bounds
      }),
      new Box({
        color: new Color(0, 0, 255)
      }),
      new MinimapPoint(),
      new WorldText({
        font: 'sans-serif',
        size: 7,
        color: '#C0C0C0',
        shadow: true,
        text: `${position.x},${position.y}`,
        position: position,
      }),
      new BoxTrigger({
        type: 'world',
        bounds,
      }),
    ];
  }
};

export default Building;
