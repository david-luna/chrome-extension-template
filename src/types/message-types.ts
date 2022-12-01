import { TabState } from './background-types';

export enum MessageType {
  SET_POPUP_TIMESTAMP = 'SET_POPUP_TIMESTAMP',
  SET_TAB_STATE = 'SET_TAB_STATE',
  TAB_STATE_UPDATE = 'TAB_STATE_UPDATE',
  TAB_CHANGED = 'TAB_CHANGE',
  RELOAD_PAGE = 'RELOAD_PAGE',
  CONSOLE = 'CONSOLE',
}

export interface Message<T> {
  type: MessageType;
  payload: T;
}

export interface SetPopupTimestampMessage {
  type: MessageType.SET_POPUP_TIMESTAMP;
  payload: number;
}

export interface SetTabStateMessage {
  type: MessageType.SET_TAB_STATE;
  payload: TabState;
}

export interface TabStateUpdateMessage {
  type: MessageType.TAB_STATE_UPDATE;
  payload: TabState;
}




export const EXTENSION_SOURCE = 'extension-template';
export type ExtensionMessage = 
  (
    SetPopupTimestampMessage |
    SetTabStateMessage |
    TabStateUpdateMessage
  ) & { source: typeof EXTENSION_SOURCE };
