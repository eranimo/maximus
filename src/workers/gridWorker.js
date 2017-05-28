// @flow

let weights: Uint8Array;
let size: Object = {};

function getCell(array: Uint8Array, x: number, y: number): number {
  return array[y * size.width + x];
}
function setCell(array: Uint8Array, x: number, y: number, value: number) {
  array[y * size.width + x] = value;
}

const events = {
  init({ width, height }: { width: number, height: number }) {
    weights = new Uint8Array(width * height);
    weights.fill(1);
    size.width = width;
    size.height = height;
    console.log(size);
  },
  set({ x, y, weight }: { x: number, y: number, weight: number }) {
    setCell(weights, x, y, weight);
  }
};

self.addEventListener('message', (event: MessageEvent) => {
  const { type, payload } = (event.data: any);
  if (type in events) {
    events[type](payload);
  }
});

self.onerror = (error: Error) => {
  console.error(error);
};
