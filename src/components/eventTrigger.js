import { Component } from '../entityManager';
import Rectangle from '../geometry/rectangle';


export default class EventTrigger extends Component {
  state: {
    bounds: Rectangle
  };

  isClicked: boolean;
  isHover: boolean;
}
