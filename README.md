# Maximus
A Javascript canvas-based 2D top-down game engine.

# Developer Installation
1. `npm install` or `yarn install`
2. `npm run start` or `yarnpkg start`

# Design

## Component Architecture

### Entities
All game objects are instances of the `Entity` class. Entities are containers for Components.

#### List of Entities
- Building
  - GridCell
  - Box
  - EventTrigger
  - MinimapPoint

### Components
A `Component` encapsulates a specific behavior for an object. A component is an instance separate from its parent entity. A component has its own state which can be serialized to JSON. This enables the entire state of the system to be saved and reloaded at any time. Most behaviors can be implemented as components.

#### List of Components
- GridCell - gives an entity a position on the game grid, handles neighbors
- Box - renders a rectangle in the game space
- EventTrigger - handles mouse and keyboard events
- MinimapPoint - renders a point on the minimap
- MinimapFrame - renders the minimap frame
- MinimapBackdrop - renders the minimap background
- UIViewportText - renders text on the viewport space
- UIWorldText - renders text on the world space

### Systems
A `System` is a class whose instances are used to control components.


#### List of Systems
- RenderSystem
- display (from RenderSystem)
- event
- minimap (from RenderSystem)
- ui (from RenderSystem)
