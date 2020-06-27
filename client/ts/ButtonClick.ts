import Settings from './Settings';
import WebSocketClient from './WebSocketClient';

export default class ButtonClick {
  private readonly _id: number;
  private _pressTimer: NodeJS.Timeout;

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
  }

  /**
   * Initializes the settings menu on button hold
   */
  execute(): void {
    WebSocketClient.sendMessage('load-flows', this._id.toString());
  }
}
