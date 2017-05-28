// @flow
import SpritemapLoader from 'worker-loader!../workers/spritemapLoader';
import { keyBy } from 'lodash';


export default function loadTilemap(): Promise<Object> {
  return new Promise((resolve: Function, reject: Function) => {
    const worker = new SpritemapLoader();
    worker.postMessage({
      url: require('../images/tiles/terrain.png'),
      size: 32,
      sprites: {
        desert: {
          col: 2,
          row: 4,
        }
      }
    });

    worker.onmessage = (event: any) => {
      if (event.data.err) {
        throw new Error(event.data.err);
      }
      const sprites = keyBy(event.data, 'name');
      resolve(sprites);
    };
  });
}
