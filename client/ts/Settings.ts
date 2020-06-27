import obsRequests from '../../json/obs-requests.json';
import { Flow } from 'sc-shared';
import WebSocketClient from './WebSocketClient';

export default class Settings {
  private readonly _settingsDiv: HTMLElement;
  private readonly _id: number;

  private _flows: Flow[][];

  /**
   * Controls display over the settings menu and manages it
   */
  constructor(id: number, flows: Flow[][]) {
    this._id = id;
    this._flows = flows;
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
  }

  /**
   * When the user clicks somewhere outside the settings menu, the settings menu will be closed
   * @param event The mouse event which is required to determine which element was clicked
   */
  private onClickHide(event: MouseEvent): void {
    if ((event.target as HTMLElement).className !== 'settings') return;
    this._settingsDiv.style.display = 'none';
    while (this._flows.length < 12) this._flows.push([]);
    const divArray: NodeListOf<Element> = document.querySelectorAll(
      'div.settings > div > div'
    );

    for (let i: number = 0; i < divArray.length - 1; i += 2) {
      const program: Element = divArray[i];
      const action: Element = divArray[i + 1];
      this._flows[this._id - 1].push({
        action: ((action as HTMLDivElement).children[0] as HTMLSelectElement)
          .value,
        program: ((program as HTMLDivElement).childNodes[0] as Text).nodeValue,
      });
    }
    WebSocketClient.sendMessage('save-flows', undefined, this._flows);
  }

  /**
   * Executes whenever the button to add a “flow” is pressed. This adds another function to a button on the panel
   */
  private onAddFlowClick(): void {
    const addFlowButton: HTMLElement = document.querySelector(
      'div.add-flow-button-parent-parent'
    ) as HTMLElement;
    const programDiv: HTMLDivElement = document.createElement('div');
    const programKey: Text = document.createTextNode('Program ');
    const actionDiv: HTMLDivElement = document.createElement('div');
    const actionKey: Text = document.createTextNode('Action ');
    programDiv.appendChild(programKey);
    programDiv.appendChild(this.programSelector());
    actionDiv.appendChild(actionKey);
    actionDiv.appendChild(this.actionSelectorOBS());
    addFlowButton.replaceWith(programDiv);
    document.querySelector('div.settings > div').appendChild(actionDiv);
    document.querySelector('div.settings > div').appendChild(addFlowButton);
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

  private actionSelectorOBS(): HTMLSelectElement {
    const actionSelector: HTMLSelectElement = document.createElement('select');
    const actions: HTMLOptionElement[] = this.obsActionOptions();

    for (const action of actions) actionSelector.appendChild(action);
    return actionSelector;
  }

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
