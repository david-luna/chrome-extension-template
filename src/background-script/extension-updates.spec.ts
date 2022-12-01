import { mockChrome } from '../__test__/mock-chrome';
import * as messaging from '../messaging';
import { BackgroundState, EXTENSION_SOURCE, MessageType, WebResource } from '../types';
import { updateBadgeText, updateExtensionStatus, broadcastTabState } from './extension-updates';
import { hashCode } from '../utils/hash-code';

describe('extension update methods', () => {

  const enableSpy = jest.fn();
  const disableSpy = jest.fn();
  const setIconSpy = jest.fn();
  const sendMessageSpy = jest.fn();
  const setBadgeTextSpy = jest.fn();
  const getURLSpy = jest.fn();
  const queryTabSpy = jest.fn();
  const sendMessageTabSpy = jest.fn();
  const mockedChrome = mockChrome({
    action: { enable: enableSpy,disable: disableSpy,setIcon: setIconSpy, setBadgeText: setBadgeTextSpy },
    runtime: { sendMessage: sendMessageSpy, getURL: getURLSpy },
    tabs: { query: queryTabSpy, sendMessage: sendMessageTabSpy },
  });

  const messagingSpy = jest.spyOn(messaging, 'sendMessage');
  const messagingTabSpy = jest.spyOn(messaging, 'sendMessageToActiveTab');

  afterEach(() => {
    jest.resetAllMocks();
  });
  const resource: WebResource = { type: 'script', url: 'https://localhost/script.js' };
  const resourceHash = hashCode(resource.url);

  const stateWithNoTab = {
    activeTab: 9876,
    popupTime: 0,
    1234: { resources: { [resourceHash]: resource } },
  } as BackgroundState;

  const stateWithTab = {
    activeTab: 1234,
    popupTime: 0,
    1234: { resources: { [resourceHash]: resource } },
  } as BackgroundState;


  describe('updateBadgeText', () => {
    it('should set text to empty if there is no state for the active tab', () => {
      updateBadgeText(stateWithNoTab);

      expect(setBadgeTextSpy).toHaveBeenCalledWith({ text: '' });
    });

    it('should set text to not empty if there is state for the acctive tab', () => {
      updateBadgeText(stateWithTab);

      expect(setBadgeTextSpy).toHaveBeenCalledWith({ text: 'A' });
    });
  });

  describe('updateExtensionStatus', () => {
    beforeEach(() => {
      getURLSpy.mockImplementation((path) => `xxx/${path}`);
    });

    it('should disable the extension if the active tab has no config', () => {
      updateExtensionStatus(stateWithNoTab);

      expect(disableSpy).toHaveBeenCalled();
      expect(setIconSpy).toHaveBeenCalledWith({ path: 'xxx/assets/disabled.png' });
    });

    it('should enable the extension if the active tab has config', () => {
      updateExtensionStatus(stateWithTab);

      expect(enableSpy).toHaveBeenCalled();
      expect(setIconSpy).toHaveBeenCalledWith({ path: 'xxx/assets/enabled.png' });
    });
  });

  describe('broadcastTabState', () => {
    it('should send configuration of the active tab if exists', () => {
      const expectedMessage = {
        type: MessageType.TAB_STATE_UPDATE,
        payload: { tabState: stateWithTab[1234], tabId: 1234 },  
      };

      broadcastTabState(stateWithTab);

      expect(messagingSpy).toBeCalledWith(expectedMessage);
      expect(messagingTabSpy).toBeCalledWith(expectedMessage);
    });

    it('should send void configuration if the active tab does not have state', () => {
      const expectedMessage = {
        type: MessageType.TAB_STATE_UPDATE,
        payload: { tabState: void 0, tabId: 9876 },  
      };

      broadcastTabState(stateWithNoTab);

      expect(messagingSpy).toBeCalledWith(expectedMessage);
      expect(messagingTabSpy).toBeCalledWith(expectedMessage);
    });
  });
});
