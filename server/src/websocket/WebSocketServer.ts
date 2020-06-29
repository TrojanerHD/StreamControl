import * as WebSocket from 'ws';
import { WebSocketMessage, WEBSOCKETPORT } from 'sc-shared';
import FlowsFileHandler from '../FlowsFileHandler';
import OBSHandler from '../programs/OBSHandler';

export default class WebSocketServer {
  private _ws: WebSocket;

  /**
   * Starts the websocket server
   */
  public startServer(): void {
    const wss: WebSocket.Server = new WebSocket.Server({ port: WEBSOCKETPORT });
    wss.on('connection', this.onConnect.bind(this));
  }

  /**
   * Executes whenever a websocket connects
   * @param ws The connected websocket
   */
  private onConnect(ws: WebSocket): void {
    this._ws = ws;
    this._ws.on('message', this.onMessage.bind(this));
  }

  /**
   * Executes whenever the websocket sends a message
   * @param message The message sent by the websocket client
   */
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
        break;
      case 'obs':
        OBSHandler.checkConnection(value);
    }
  }
}
