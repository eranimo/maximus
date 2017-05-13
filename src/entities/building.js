// @flow
import type { EntityType } from '../entityManager';
import Color from '../utils/color';
import Point from '../geometry/point';
import { Box, BoxTrigger } from '../components/box';
import { MinimapPoint } from '../components/minimap';
import { WorldText } from '../components/ui';
import { MapPosition } from '../components/position';


const Building: EntityType = {
  name: 'Building',
  components: ({ position }: { position: Point }): any => {
    return [
      new MapPosition({
        position,
        weight: 0,
        type: 'world',
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
      }),
    ];
  }
};

export default Building;
