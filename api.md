# Entity
## Properties
- `components` - *Map<string, Component>* - a Map of component names to Component instances

## Instance Methods
- `addComponent` - Adds a component to this entity
- `getByType` - Get a list of member components by a Component type
- `fromJSON` - Creates an entity from a JSON source


# Component

## Static Properties
- `dependencies` - *Array<Class<Component>>* - a list of components whose update methods are ran before this component's update method. If the entity does not contain these components an exception will be thrown.

## Properties
- `entity` - *Entity*
- `state` - *Object* - the current state of the component

## Instance Methods
- `init` - called when this component is added to an entity
- `destroy` - called when this component is removed from an entity
- `update` - called on the game loop after its dependencies
- `emit(String eventName, Object eventValue)` - broadcast an event to the components in this entity
- `on(Event event)` - respond to an event broadcasted to this component
- `toJSON` - serialized the component's state as a JSON object

## Static Methods
- `fromJSON` - creates a component instance from a serialized component state


# System

#### Properties
- `components` - *Array<Class<Component>>* - a list of component types this system operates on
#### Methods
- `update` - called once every game loop. Allows a system to dispatch events components
