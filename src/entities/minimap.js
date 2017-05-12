// @flow
import type { EntityType } from '../entityManager';
import Rectangle from '../geometry/rectangle';
import { MINIMAP_WIDTH, MINIMAP_HEIGHT } from '../constants';
import Point from '../geometry/point';
import { MinimapFrame, MinimapBackdrop, MinimapLogic } from '../components/minimap';


const Minimap: EntityType = {
  name: 'Minimap',
  components: (): any => ([
    new MinimapFrame(),
    new MinimapBackdrop(),
    new MinimapLogic({
      type: 'viewport',
      bounds: new Rectangle(
        new Point(
          window.innerWidth - MINIMAP_WIDTH,
          window.innerHeight - MINIMAP_HEIGHT,
        ),
        MINIMAP_WIDTH + 2,
        MINIMAP_HEIGHT + 2
      )
    })
  ])
};

export default Minimap;
