export const WEBSOCKETPORT = 6969;

export interface WebSocketMessage {
  event: string;
  message: string;
  flows?: Flow[][];
}

export interface Flow {
  program: string;
  action: string;
}