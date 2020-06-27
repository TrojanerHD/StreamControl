import { WEBSOCKETPORT, WebSocketMessage, Flow } from 'sc-shared';
import Settings from './Settings';

export default class WebSocketClient {
  static _ws: WebSocket;

  connect(): void {
    alert(`ws://${window.location.hostname}:${WEBSOCKETPORT.toString()}`)
    WebSocketClient._ws = new WebSocket(
      `ws://${window.location.hostname}:${WEBSOCKETPORT.toString()}`
    );
    WebSocketClient._ws.onmessage = this.onMessage.bind(this);
  }

  private onMessage(message: MessageEvent): void {
    const json: WebSocketMessage = JSON.parse(message.data);
    const value: string = json.message;

    switch (json.event) {
      case 'load-flows':
        new Settings(+value, json.flows!).show();
    }
  }

  public static sendMessage(event: string, message: string, flows?: Flow[][]): void {
    WebSocketClient._ws.send(JSON.stringify({ event, message, flows }));
  }
}
