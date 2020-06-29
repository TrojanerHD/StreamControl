import ButtonClick from './ButtonClick';
import { Button } from 'sc-shared';

export default class Buttons {
  /**
   * Creates buttons on the page
   * @param buttonCount How many buttons are going to be created
   */
  constructor(buttonCount: number) {
    for (let i: number = 0; i < buttonCount; i++) {
      const buttonProperties: Button = ButtonClick._flows[i].button;
      const button: HTMLDivElement = document.createElement('div');
      const buttonInnerDiv: HTMLDivElement = document.createElement('div');
      const buttonText: Text = document.createTextNode(buttonProperties.name);
      buttonInnerDiv.appendChild(buttonText);
      button.appendChild(buttonInnerDiv);
      button.id = (i + 1).toString();
      button.style.backgroundColor = buttonProperties.color;
      button.className = 'button';
      const buttonClick: ButtonClick = new ButtonClick(i + 1);
      button.onmousedown = buttonClick.onMouseDown.bind(buttonClick);
      button.onmouseup = buttonClick.onMouseUp.bind(buttonClick);
      button.ontouchstart = buttonClick.onMouseDown.bind(buttonClick);
      button.ontouchend = buttonClick.onMouseUp.bind(buttonClick);
      document.querySelector('div.content').appendChild(button);
    }
  }
}
