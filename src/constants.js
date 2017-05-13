// @flow

export const SCENE_CELLS_WIDTH = 500;
export const SCENE_CELLS_HEIGHT = 500;
export const CELL_SIZE = 20;
export const SCENE_WIDTH = SCENE_CELLS_WIDTH * CELL_SIZE;
export const SCENE_HEIGHT = SCENE_CELLS_HEIGHT * CELL_SIZE;
export const VIEWPORT_WIDTH = window && window.innerWidth;
export const VIEWPORT_HEIGHT = window && window.innerHeight;
export const ZOOM_MIN = 0.2;
export const ZOOM_MAX = 3.0;
export const ZOOM_INTERVAL = 0.005;
export const MINIMAP_WIDTH = 200;
export const MINIMAP_HEIGHT = 200;
