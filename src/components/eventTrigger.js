import { Component } from '../entityManager';
import Rectangle from '../rectangle';


export default class EventTrigger extends Component {
  state: {
    bounds: Rectangle
  };

  isClicked: boolean;
  isHover: boolean;
}
