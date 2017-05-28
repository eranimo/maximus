// @flow
import type { EntityType } from '../engine/entity';
import Color from '../utils/color';
import Point from '../geometry/point';
import { Tile, BoxTrigger } from '../components/tile';
import MinimapPoint from '../components/minimapPoint';
import { WorldText } from '../components/ui';
import { MapPosition } from '../components/position';
import { random } from 'lodash';


let sprites = [
  {
    spritemap: 'main',
    row: 6,
    col: 1,
    color: new Color(175, 161, 73),
  },
  {
    spritemap: 'main',
    row: 6,
    col: 2,
    color: new Color(195, 151, 83),
  },
  {
    spritemap: 'main',
    row: 6,
    col: 3,
    color: new Color(195, 151, 83),
  },
  {
    spritemap: 'main',
    row: 4,
    col: 2,
    color: new Color(195, 151, 83),
  },
];

const Building: EntityType = {
  name: 'Building',
  components: ({ position }: { position: Point }): any => {
    const sprite = sprites[random(sprites.length - 1)];
    return [
      new MapPosition({
        position,
        weight: 0,
        type: 'world',
      }),
      new Tile(sprite),
      new MinimapPoint({
        color: sprite.color,
        isStatic: true,
      }),
      // new WorldText({
      //   font: 'sans-serif',
      //   size: 7,
      //   color: '#C0C0C0',
      //   shadow: true,
      //   text: `${position.x},${position.y}`,
      //   position: position,
      // }),
      // new BoxTrigger({
      //   type: 'world',
      // }),
    ];
  }
};

export default Building;
