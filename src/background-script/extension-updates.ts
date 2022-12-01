import { sendMessage, sendMessageToActiveTab } from '../messaging';
import { BackgroundState, MessageType } from '../types';


export const updateBadgeText = (state: BackgroundState): void => {
  // TODO: logic to calculate text
  const tabState = state[state.activeTab];
  const text = tabState ? 'A' : '';

  chrome.action.setBadgeText({ text });
};

export const updateExtensionStatus = (state: BackgroundState): void => {
  const isEnabled = !!state[state.activeTab];
  const iconPath = `assets/${isEnabled ? 'enabled' : 'disabled'}.png`;
  const path = chrome.runtime.getURL(iconPath);

  if (isEnabled) {
    chrome.action.enable();
  } else {
    chrome.action.disable();
  }
  chrome.action.setIcon({ path });
};

export const broadcastTabState = (state: BackgroundState): void => {
  const tabId = state.activeTab;
  const tabState = state[tabId];
  const message = {
    type: MessageType.TAB_STATE_UPDATE,
    payload: { tabState, tabId },
  };

  // To the popup
  sendMessage(message);

  // To content script
  sendMessageToActiveTab(message);
};
