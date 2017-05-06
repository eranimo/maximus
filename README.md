# Maximus
A Javascript canvas-based 2D top-down game engine.

# Developer Installation
1. `npm install` or `yarn install`
2. `npm run start` or `yarnpkg start`

# Design

## Component Architecture

### Entities
All game objects are instances of the `Entity` class. Entities are containers for Components.

### Components
A `Component` encapsulates a specific behavior for an object. A component is an instance separate from its parent entity. A component has its own state which can be serialized to JSON. This enables the entire state of the system to be saved and reloaded at any time. Many concepts can be implemented as components.

#### Examples
- `DisplayComponent` -
- `UIComponent` - handles the display of an object
- `EventTrigger` - respond to events from the keyboard

### Systems
A `System` is a class whose instances are used to control components.

#### Examples
- `RenderSystem` - render DisplayComponents and UIComponents
- `EventSystem` - provide user feedback to EventTrigger
