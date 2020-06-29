import obsRequests from '../../json/obs-requests.json';
import { FlowButton, Flow } from 'sc-shared';
import WebSocketClient from './WebSocketClient';
import ButtonClick from './ButtonClick';

interface FlowSelectors {
  program: HTMLSelectElement;
  action: HTMLSelectElement;
}
export default class Settings {
  private readonly _settingsDiv: HTMLElement;
  private readonly _id: number;

  /**
   * Controls display over the settings menu and manages it
   */
  constructor(id: number) {
    this._id = id;
    this._settingsDiv = document.querySelector('div.settings') as HTMLElement;
  }

  /**
   * Shows the settings menu
   */
  show(): void {
    this._settingsDiv.style.display = 'flex';
    this._settingsDiv.onmousedown = this.onClickHide.bind(this);
    this._settingsDiv.ontouchstart = this.onClickHide.bind(this);
    (document.querySelector(
      'div.add-flow-button'
    ) as HTMLElement).onclick = this.onAddFlowClick.bind(this);

    const button: FlowButton = ButtonClick._flows[this._id - 1];

    for (const flow of button.actions) {
      const selectors: FlowSelectors = this.onAddFlowClick();
      selectors.action.value = flow.action;
      selectors.program.value = flow.program;
    }

    (document.querySelector('input#button-name') as HTMLInputElement).value = button.button.name;
    (document.querySelector('input#button-color') as HTMLInputElement).value = button.button.color;
  }

  /**
   * When the user clicks somewhere outside the settings menu, the settings menu will be closed
   * @param event The mouse event which is required to determine which element was clicked
   */
  private onClickHide(event: MouseEvent): void {
    if ((event.target as HTMLElement).className !== 'settings') return;
    this._settingsDiv.style.display = 'none';
    const divArray: Element[] = Array.from(
      document.querySelectorAll('div.settings > div > div')
    ).filter(
      (divElement: Element) =>
        divElement.className !== 'add-flow-button-parent-parent' &&
        divElement.className !== 'header'
    );

    let currentFlowArray: FlowButton = ButtonClick._flows[this._id - 1];
    currentFlowArray.actions = currentFlowArray.actions.slice(0, 0);

    for (let i: number = 0; i < divArray.length; i += 2) {
      const program: Element = divArray[i];
      const action: Element = divArray[i + 1];
      currentFlowArray.actions.push({
        action: ((action as HTMLDivElement).children[0] as HTMLSelectElement)
          .value,
        program: ((program as HTMLDivElement).children[0] as HTMLSelectElement)
          .value,
      });
    }
    currentFlowArray.button.color = (document.querySelector(
      'input#button-color'
    ) as HTMLInputElement).value;
    currentFlowArray.button.name = (document.querySelector(
      'input#button-name'
    ) as HTMLInputElement).value;

    ButtonClick._flows[this._id - 1] = currentFlowArray;
    const button: HTMLDivElement = document.querySelectorAll('div.button')[
      this._id - 1
    ] as HTMLDivElement;
    button.style.backgroundColor = currentFlowArray.button.color;
    (button.children[0] as HTMLDivElement).innerHTML =
      currentFlowArray.button.name;
    WebSocketClient.sendMessage('save-flows', undefined, ButtonClick._flows);

    for (const div of Array.from(divArray)) div.remove();
  }

  /**
   * Executes whenever the button to add a “flow” is pressed. This adds another function to a button on the panel
   */
  private onAddFlowClick(): FlowSelectors {
    const addFlowButton: HTMLElement = document.querySelector(
      'div.add-flow-button-parent-parent'
    ) as HTMLElement;
    const programDiv: HTMLDivElement = document.createElement('div');
    const programKey: Text = document.createTextNode('Program ');
    const actionDiv: HTMLDivElement = document.createElement('div');
    const actionKey: Text = document.createTextNode('Action ');
    const programSelector: HTMLSelectElement = this.programSelector();
    const actionSelectorOBS: HTMLSelectElement = this.actionSelectorOBS();
    programDiv.appendChild(programKey);
    programDiv.appendChild(programSelector);
    actionDiv.appendChild(actionKey);
    actionDiv.appendChild(actionSelectorOBS);
    addFlowButton.replaceWith(programDiv);
    document.querySelector('div.settings > div').appendChild(actionDiv);
    document.querySelector('div.settings > div').appendChild(addFlowButton);
    return { program: programSelector, action: actionSelectorOBS };
  }

  /**
   * Adds a selector to a flow where you can select a program in which the certain action will take place
   */
  private programSelector(): HTMLSelectElement {
    const programValue: HTMLSelectElement = document.createElement('select');
    const programs: HTMLOptionElement[] = [
      this.programOption('obs', 'OBS Studio'),
    ];

    for (const program of programs) programValue.appendChild(program);
    return programValue;
  }

  /**
   * Returns an option element that can be added to the program selector
   * @param value The value of the option field
   * @param name The display name of the option field
   */
  private programOption(value: string, name: string): HTMLOptionElement {
    const option: HTMLOptionElement = document.createElement('option');
    option.value = value;
    option.appendChild(document.createTextNode(name));
    return option;
  }

  /**
   * Returns the selector element for all available actions for OBS
   */
  private actionSelectorOBS(): HTMLSelectElement {
    const actionSelector: HTMLSelectElement = document.createElement('select');
    const actions: HTMLOptionElement[] = this.obsActionOptions();

    for (const action of actions) actionSelector.appendChild(action);
    return actionSelector;
  }

  /**
   * Returns all options for all available actions for OBS
   */
  private obsActionOptions(): HTMLOptionElement[] {
    const options: HTMLOptionElement[] = [];
    for (const key of Object.keys(obsRequests)) {
      const value: string = obsRequests[key];
      const option: HTMLOptionElement = document.createElement('option');
      option.value = key;
      option.appendChild(document.createTextNode(value));
      options.push(option);
    }
    return options;
  }
}
