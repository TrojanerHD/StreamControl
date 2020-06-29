import * as OBSWebSocket from 'obs-websocket-js';

export default class OBSHandler {
  static obsWebSocket: OBSWebSocket = undefined;

  static checkConnection(action: string) {
    if (!OBSHandler.obsWebSocket) {
      OBSHandler.obsWebSocket = new OBSWebSocket();
      OBSHandler.obsWebSocket.connect({ address: 'localhost:4444' }).then(() => OBSHandler.execute(action));
      return;
    }
    OBSHandler.execute(action);
  }

  static execute(action: string): void {
    OBSHandler.obsWebSocket.send(action as any);
  }
}
