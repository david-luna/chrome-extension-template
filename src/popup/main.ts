import { sendMessage } from '../messaging';
import { ExtensionMessage, MessageType } from '../types';
import App from './App.svelte';

export default new App({
  target: document.querySelector('body'),
});

window.onload = () => {
  sendMessage({
    type: MessageType.SET_POPUP_TIMESTAMP,
    payload: Date.now(),
  });
}
