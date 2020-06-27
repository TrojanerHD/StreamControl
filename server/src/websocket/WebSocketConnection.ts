import WebSocket from 'ws';
import { WebSocketMessage, Flow } from 'sc-shared';
import FlowsFileHandler from '../FlowsFileHandler';

export default class WebSocketConnection {
  private _ws: WebSocket;

  public connect(ws: WebSocket): void {
    this._ws = ws;
    this._ws.on('message', this.onMessage.bind(this));
  }

  private onMessage(message: string): void {
    const json: WebSocketMessage = JSON.parse(message);
    const value: string = json.message;

    switch (json.event) {
      case 'save-flows':
        FlowsFileHandler.saveFlows(json.flows!);
        break;
      case 'load-flows':
        this._ws.send(
          JSON.stringify({
            event: 'load-flows',
            message: value,
            flows: FlowsFileHandler.loadFlows(),
          })
        );
    }
  }
}
