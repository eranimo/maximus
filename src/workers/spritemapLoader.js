// @flow


// Taken from https://developers.google.com/web/updates/2016/03/createimagebitmap-in-chrome-50

self.addEventListener('message', (event: MessageEvent) => {
  const {
    url,
    sprites,
    size
  }: {
    url: string,
    sprites: { [string]: Object },
    size: number
  } = (event.data: any);

  fetch(url)
    .then((response: Object): Blob => response.blob())
    .then((blob: Object): Promise<any> => {
      return Promise.all(
        Object.entries(sprites)
          .map(([name, coord]: [string, any]): Promise<ImageBitmap> => {
            return new Promise((resolve: Function) => {
              self.createImageBitmap(
                blob,
                (coord.col - 1) * size,
                (coord.row - 1) * size,
                size,
                size,
              ).then((image: ImageBitmap) => {
                resolve({
                  image,
                  name,
                  size,
                  ...coord,
                });
              });
            });
          })
      );
    })
    .then((sprites: Object) => {
      self.postMessage(sprites, sprites.map((sprite: Object): ImageBitmap => sprite.image));
    }, (err: Error) => {
      self.postMessage({ err });
    });
});


self.onerror = (error: Error) => {
  console.error(error);
};
