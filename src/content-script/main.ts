import { sendMessage, listenMessage } from '../messaging';
import { MessageType } from "../types";

// Mokeypatch of XMLHTTPRequest && fetch
// https://stackoverflow.com/questions/8939467/chrome-extension-to-read-http-response/48134114#48134114
// https://www.moesif.com/blog/technical/apirequest/How-We-Captured-AJAX-Requests-with-a-Chrome-Extension/
const s = document.createElement('script');
s.src = chrome.runtime.getURL('dist/injected-script.js');
s.onload = function(this: HTMLScriptElement) {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);


/**
 * Get messages from the service woerker and popup and bypas to injected script
 */
listenMessage((message) => {
  switch(message.type) {
    case MessageType.TAB_STATE_UPDATE:
      window.postMessage(message, '*');
      break;
  }
});

// Listen messages from the page itself (injected script) and bypass to extension
window.addEventListener('message', (event) => {
  const { data } = event;
  
  // TODO: filter out messages from other scripts
  // sendMessage(data);
});
