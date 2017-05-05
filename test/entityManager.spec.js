// @flow
import EntityManager, { Component, Entity } from '../src/entityManager';

class FoobarComponent extends Component {
  ticks: number;

  init(state: Object) {
    this.ticks = state.ticks;
  }

  update() {
    this.ticks++;
  }
}
const foobarComponent = FoobarComponent;

describe('EntityManager', () => {
  const manager: EntityManager = new EntityManager();

  it('should load state from object', () => {
    manager.addComponent('Foobar', foobarComponent);


    const fooEntity: Entity = manager.addEntity(new Map([
      [foobarComponent, {
        ticks: 0
      }],
    ]));

    manager.update();
    const foobarComp: ?FoobarComponent = fooEntity.getComponent('Foobar');
    if (!foobarComp) {
      throw new Error('Foobar component not found!');
    }
    expect(foobarComp.ticks).toBe(1);
  });
});
