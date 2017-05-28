/* eslint-disable */
// Taken from https://developers.google.com/web/updates/2016/03/createimagebitmap-in-chrome-50

self.addEventListener('message', event => {
  Promise.all(event.data.map(({ url }) => fetch(url)))
    .then(responses => Promise.all(responses.map(response => response.blob())))
    .then(blobs => Promise.all(blobs.map(blob => self.createImageBitmap(blob))))
    .then((spritemaps) => {
      self.postMessage(
        event.data.map((spritemap, index) => {
          return {
            ...spritemap,
            image: spritemaps[index],
          };
        }),
        spritemaps
      );
    }, (err: Error) => {
      self.postMessage({ err });
    });
});


self.onerror = (error: Error) => {
  console.error(error);
};
