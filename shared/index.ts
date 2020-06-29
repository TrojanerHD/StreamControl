export const WEBSOCKETPORT: number = 6969;
export const BUTTONCOUNT: number = 12;

/**
 * A standarized websocket message for simplifying the sending and receiving of data
 */
export interface WebSocketMessage {
  event: string;
  message: string;
  flows?: FlowButton[];
}

/**
 * A flow which contains the program and the action to be made
 */
export interface FlowButton {
  button: Button;
  actions: Flow[];
}

export interface Flow {
  program: string;
  action: string;
}

export interface Button {
  name: string;
  color: string;
}