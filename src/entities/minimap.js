// @flow
import type { EntityType } from '../entityManager';
import Rectangle from '../geometry/rectangle';
import { MINIMAP_WIDTH, MINIMAP_HEIGHT } from '../constants';
import Point from '../geometry/point';


const Minimap: EntityType = {
  name: 'Minimap',
  components: (): Object => ({
    minimapFrame: {},
    minimapBackdrop: {},
    minimapLogic: {
      type: 'viewport',
      bounds: new Rectangle(
        new Point(
          window.innerWidth - MINIMAP_WIDTH,
          window.innerHeight - MINIMAP_HEIGHT,
        ),
        MINIMAP_WIDTH + 2,
        MINIMAP_HEIGHT + 2
      )
    }
  })
};

export default Minimap;
