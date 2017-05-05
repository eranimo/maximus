// @flow
import EntityManager, { Component, Entity } from '../src/entityManager';

class FoobarComponent extends Component {
  state: {
    ticks: number
  };
  foo: number;

  init() {
    this.foo = this.entity.components.size;
  }

  update() {
    this.state.ticks++;
  }
}
const foobarComponent = FoobarComponent;

describe('EntityManager', () => {
  const manager: EntityManager = new EntityManager();
  manager.registerComponent('foobar', foobarComponent);
  const fooEntity: Entity = manager.addEntity({
    foobar: {
      ticks: 0
    }
  });

  it('should load state from object', () => {
    const foobarComp: ?FoobarComponent = fooEntity.getComponent('foobar');
    if (!foobarComp) {
      throw new Error('Foobar component not found!');
    }
    expect(foobarComp.state.ticks).toBe(0);
  });

  it('should update components', () => {
    const foobarComp: ?FoobarComponent = fooEntity.getComponent('foobar');
    if (!foobarComp) {
      throw new Error('Foobar component not found!');
    }
    manager.update();
    expect(foobarComp.state.ticks).toBe(1);
  });

  it('should get components in all entities', () => {
    expect(manager.getComponents('foobar').length).toBe(1);
    expect(manager.getComponents('foobar')[0]).toBeInstanceOf(FoobarComponent);
  });

  it('should export entity state', () => {
    expect(fooEntity.export()).toEqual({
      foobar: {
        ticks: 1
      }
    });
  });
});
