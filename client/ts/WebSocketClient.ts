import { WEBSOCKETPORT, WebSocketMessage, FlowButton, BUTTONCOUNT } from 'sc-shared';
import ButtonClick from './ButtonClick';
import Buttons from './Buttons';

export default class WebSocketClient {
  static _ws: WebSocket;

  /**
   * Initializes a connection to the websocket
   */
  connect(): void {
    WebSocketClient._ws = new WebSocket(
      `ws://${window.location.hostname}:${WEBSOCKETPORT.toString()}`
    );
    WebSocketClient._ws.onmessage = this.onMessage.bind(this);
    WebSocketClient._ws.onopen = this.onOpen.bind(this);
  }

  private onOpen(): void {
    WebSocketClient.sendMessage('load-flows', undefined);
  }

  /**
   * Executes whenever a message is sent from the websocket server
   * @param message The message from the websocket server
   */
  private onMessage(message: MessageEvent): void {
    const json: WebSocketMessage = JSON.parse(message.data);
    const value: string = json.message;

    switch (json.event) {
      case 'load-flows':
        ButtonClick._flows = json.flows!;
        new Buttons(BUTTONCOUNT);
    }
  }

  /**
   * Sends a preformatted message to the websocket server
   * @param event What type of event is sent
   * @param message The message to be sent
   * @param flows The current flows in case the event is 'save-flows'
   */
  public static sendMessage(
    event: string,
    message: string,
    flows?: FlowButton[]
  ): void {
    WebSocketClient._ws.send(JSON.stringify({ event, message, flows }));
  }
}
