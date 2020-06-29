import WebSocketClient from './WebSocketClient';
import { FlowButton } from 'sc-shared';
import Settings from './Settings';

enum Context {
  LONGPRESS,
  SHORTPRESS,
}
export default class ButtonClick {
  private readonly _id: number;
  private _pressTimer: NodeJS.Timeout;
  private static _longPress: boolean = false;
  static _flows: FlowButton[] = undefined;

  /**
   * Adds a click event listener to button with specified id
   * @param id Button ID
   */
  constructor(id: number) {
    this._id = id;
  }

  /**
   * Executes whenever a button on the stream control interface is pressed
   */
  onMouseDown(): void {
    this._pressTimer = setTimeout(this.execute.bind(this), 1000);
  }

  /**
   * Executes whenever a button on the stream control interface is released
   */
  onMouseUp(): void {
    clearTimeout(this._pressTimer);
    if (ButtonClick._longPress) {
      ButtonClick._longPress = false;
      return;
    }

    for (const flow of ButtonClick._flows[this._id - 1].actions)
      WebSocketClient.sendMessage(flow.program, flow.action);
  }

  /**
   * Initializes the settings menu on button hold
   */
  private execute(): void {
    ButtonClick._longPress = true;
    new Settings(this._id).show();
  }
}
