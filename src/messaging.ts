import { ExtensionMessage, EXTENSION_SOURCE, MessageType } from './types';

/**
 * Broadcasts message in runtime which may be handled by serice worker, popup or content script
 *
 * @param rawMessage the message to send with expected type and possible payload
 */
export const sendMessage = (rawMessage: { type: MessageType, payload?: unknown }): void => {
  chrome.runtime.sendMessage(
    { ...rawMessage, source: EXTENSION_SOURCE },
    () => {
      const error = chrome.runtime.lastError;
      if (error) {
        console.log(`Unexcpected error in messaging ${error.message}`)
      }
    }
  );
};

/**
 * Broadcasts message in the active tab which may be handled by the content script in that tab.
 *
 * @param rawMessage the message to send with expected type and possible payload
 */
export const sendMessageToActiveTab = (rawMessage: { type: MessageType, payload?: unknown }): void => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTabId = tabs[0]?.id;
    const message = { ...rawMessage, source: EXTENSION_SOURCE };

    if (activeTabId) {
      chrome.tabs.sendMessage(
        activeTabId,
        message,
        () => {
          const error = chrome.runtime.lastError;
          if (error) {
            console.log(`Unexcpected error in tab messaging ${error.message}`)
          }
        }
      );
    } else {
      console.log('There is no active tab for message', message);
    }
  });
};


/**
 * Attachs a listener to the runtime channel to handle different types of messages
 *
 * @param handler the method for handling the message
 */
export const listenMessage = (handler: (m: ExtensionMessage, s?: chrome.runtime.MessageSender) => void): void => {
  chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
    if (message.source === EXTENSION_SOURCE) {
      handler(message, sender);
    } else {
      console.log('this is not extension message', message)
    }
    sendResponse({ source: EXTENSION_SOURCE, ack: true });
  });
}
