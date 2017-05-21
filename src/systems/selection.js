// @flow
import { System } from '../entityManager';
import type { Entity } from '../entityManager';


export default class SelectionSystem extends System {
  selected: Set<Entity>;
  canvas: HTMLElement;

  init() {
    this.selected = new Set();
  }

  select(entity: Entity) {
    const name = entity.name || 'No Name';
    if (!entity.hasComponent('MapPosition')) {
      throw new Error(`Entity '${name}' must have a MapPosition component to be able to be selected`);
    }
    if (this.selected.has(entity)) {
      console.warn(`Entity '${name}' is already selected`);
    }
    console.log(`Selected '${name}'`);
    this.selected.add(entity);
    // this.renderDOM();
  }

  deselect(entity: Entity) {
    const name = entity.name || 'No Name';
    if (this.selected.has(entity)) {
      console.log(`Deselected '${name}'`);
      this.selected.delete(entity);
      return;
    }
    console.warn(`Entity ${name} is not selected`);
    // this.renderDOM();
  }

  deselectAll() {
    this.selected = new Set();
    // this.renderDOM();
  }

  toggle(entity: Entity) {
    if (!this.systems.keyboard.isKeyPressed('shift')) {
      if (this.selected.has(entity)) {
        this.deselectAll();
        //this.deselect(entity);
      } else {
        this.deselectAll();
        this.select(entity);
      }
      return;
    }
    if (this.selected.has(entity)) {
      this.deselect(entity);
    } else {
      this.select(entity);
    }
    // this.renderDOM();
  }

  draw() {
    const ctx = this.systems.region.ctx;
    const viewport = this.systems.viewport;

    // draw selected entities
    for (const entity of this.selected) {
      const positions = entity.getComponents('MapPosition');
      if (positions.length === 1) {
        const mapPosition = positions[0];
        ctx.beginPath();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = viewport.toZoom(2);
        mapPosition.drawBounds(ctx);
        ctx.stroke();
      }
    }
  }
}
