import { mockChrome } from './__test__/mock-chrome';
import { sendMessage, sendMessageToActiveTab } from './messaging';
import { EXTENSION_SOURCE, MessageType } from './types';

describe('messaging', () => {
  const sendMessageSpy = jest.fn();
  const queryTabSpy = jest.fn();
  const sendMessageTabSpy = jest.fn();
  const mockedChrome = mockChrome({
    runtime: { sendMessage: sendMessageSpy },
    tabs: { query: queryTabSpy, sendMessage: sendMessageTabSpy },
  });
  const message = { type: MessageType.CONSOLE, payload: 'text' };
  const expectedMessage = { ...message, source: EXTENSION_SOURCE };

  afterEach(() => jest.resetAllMocks());

  it('sendMessage should send message to the runtime', () => {
    sendMessage(message);

    expect(sendMessageSpy).toBeCalledWith(expectedMessage, expect.any(Function));
  });

  it('sendMessageToActiveTab should send message to the active tab if there is one', () => {
    queryTabSpy.mockImplementation((options, callback) => { callback([{ id: 1234 }]) })
    
    sendMessageToActiveTab(message);

    expect(sendMessageTabSpy).toBeCalledWith(1234, expectedMessage, expect.any(Function));
  });

  it('sendMessageToActiveTab should send message to the active tab if there is one', () => {
    queryTabSpy.mockImplementation((options, callback) => { callback([]) })
    
    sendMessageToActiveTab(message);

    expect(sendMessageTabSpy).not.toHaveBeenCalled();
  });
});
