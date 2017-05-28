// @flow
import React, { PureComponent } from 'react';
import type Entity from '../engine/entity';
import type EntityManager from '../engine/entityManager';
import { CELL_SIZE } from '../constants';


class Selection extends PureComponent {
  propTypes: {
    manager: EntityManager,
    selected: Set<Entity>,
    following: ?Entity,
  };

  handleFollow = (entity: Entity): Function => {
    return () => {
      const { manager } = this.props;
      const position = entity.getComponents('MapPosition')[0];
      if (manager.systems.viewport.following === position)  {
        manager.systems.viewport.following = null;
      } else {
        manager.systems.viewport.following = position;
      }
    };
  }

  handleGoTo = (entity: Entity): Function => {
    return () => {
      const { manager } = this.props;
      const position = entity.getComponents('MapPosition')[0];
      manager.systems.viewport.jump(position.bounds.centroid);
    };
  }

  handleDeselect = (): Function => {
    return () => {
      this.props.manager.systems.selection.deselectAll();
    };
  }

  handleUnselect = (entity: Entity): Function => {
    return () => {
      this.props.manager.systems.selection.deselect(entity);
    };
  }

  isFollowing(entity: Entity): boolean {
    const { manager } = this.props;
    const position = entity.getComponents('MapPosition')[0];
    return manager.systems.viewport.following === position;
  }

  render(): ?React$Element<any> {
    const { selected } = this.props;

    if (selected.size === 0) {
      return null;
    }

    let selectedRows = [];
    for (const entity: Entity of selected) {
      selectedRows.push(
        <div key={selectedRows.length}>
          {entity.name} (#{entity.id}) - <span>
            <button onClick={this.handleGoTo(entity)}>Go To</button>
            <button onClick={this.handleFollow(entity)}>
              {this.isFollowing(entity) ? 'Unfolow' : 'Follow'}
            </button>
            <button onClick={this.handleUnselect(entity)}>X</button>
          </span>
        </div>
      );
    }

    return (
      <div className="selection">
        Selected: {selected.size} - <button onClick={this.handleDeselect()}>X</button>
        <hr />
        {selectedRows}
      </div>
    );
  }
}


export default Selection;
