import { listenMessage, sendMessageToActiveTab } from '../messaging';
import { ExtensionMessage, EXTENSION_SOURCE, MessageType } from '../types';
import { updateBadgeText, updateExtensionStatus, broadcastTabState }from './extension-updates';
import { loaderInterceptor } from './loader-interceptor';
import { updateRedirections } from './redirections';
import { stateFacade } from './state';

// Chrome tabs events
chrome.tabs.onRemoved.addListener((tabId) => {
  stateFacade.removeTab(tabId);
  const emptyConfig = { apps: {}, libs: {}, flags: {} }
  updateRedirections(emptyConfig, tabId);
})
chrome.tabs.onActivated.addListener((info) => {
  stateFacade.setActiveTab(info.tabId);
});

// Network events
chrome.webRequest.onBeforeRequest.addListener(
  loaderInterceptor,
  {
    urls: ['<all_urls>'],
    types: ['script', 'stylesheet']
  }
);

// Event from other sources (popup or content script)
listenMessage((message, sender) => {
  switch (message.type) {
    case MessageType.SET_POPUP_TIMESTAMP:
      stateFacade.setPopupTimestamp(message.payload)
      break;
    default:
      console.log('SW unhandled message', message);
  }
});

// Extension updates (side effects of store changes)
stateFacade.subscribe((state) => {
  updateExtensionStatus(state);
  updateBadgeText(state);
  broadcastTabState(state);
});

console.log('service on!!!');
