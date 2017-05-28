// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import Selection from '../ui/selection';
import type EntityManager from '../engine/entityManager';


export default function initUI(manager: EntityManager) {
  ReactDOM.render(
    <Selection
      manager={manager}
      selectedNumber={manager.systems.selection.selected.size}
      selected={manager.systems.selection.selected}
      following={manager.systems.viewport.following}
    />,
    document.getElementById('ui')
  );
}
