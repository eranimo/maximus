// @flow
import type { EntityType } from '../entityManager';
import { MinimapFrame, MinimapBackdrop, MinimapLogic } from '../components/minimap';


const Minimap: EntityType = {
  name: 'Minimap',
  components: (): any => ([
    new MinimapFrame(),
    new MinimapBackdrop(),
    new MinimapLogic()
  ])
};

export default Minimap;
