import * as WebSocket from 'ws';
import WebSocketConnection from './WebSocketConnection';
import { WEBSOCKETPORT } from 'sc-shared';

export default class WebSocketServer {
  public startServer(): void {
    const wss: WebSocket.Server = new WebSocket.Server({ port: WEBSOCKETPORT });
    wss.on('connection', this.onConnection);
  }

  private onConnection(ws: WebSocket): void {
    new WebSocketConnection().connect(ws);
  }
}
