// @flow
import { keyBy } from 'lodash';
import SpritemapLoader from 'worker-loader!../workers/spritemapLoader';


export default function loadTilemap(): Promise<Object> {
  return new Promise((resolve: Function, reject: Function) => {
    const worker = new SpritemapLoader();
    worker.postMessage([
      {
        name: 'main',
        size: 32,
        url: require('../images/tiles/terrain.png'),
      },
    ]);

    worker.onmessage = (event: any) => {
      if (event.data.err) {
        throw new Error(event.data.err);
      }
      resolve(keyBy(event.data, 'name'));
    };
  });
}
