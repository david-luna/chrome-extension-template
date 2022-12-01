import { mockChrome } from '../__test__/mock-chrome';
import { TabState } from '../types';
import { updateRedirections } from './redirections';

describe('redirections', () => {
  const getSessionRulesSpy = jest.fn()
  const updateSessionRulesSpy = jest.fn();
  const mockedChrome = mockChrome({
    declarativeNetRequest: {
      getSessionRules: getSessionRulesSpy,
      updateSessionRules: updateSessionRulesSpy,
    }
  });
  const tabId = 1234;
  const scriptUrl = 'https://domain.com/path/to/script.js';
  const scriptRedirect = 'https://localhost/script.js';
  const styleUrl = 'https://domain.com/path/to/style.css';
  const styleRedirect = 'https://localhost/style.css';
  const state: TabState = {
    resources: {
      'script': { type: 'script', url: scriptUrl, redirect: scriptRedirect },
      'style': { type: 'stylesheet', url: styleUrl, redirect: styleRedirect },
    }
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set the redirection rules based on a config', async () => {
    getSessionRulesSpy.mockResolvedValue([]);

    await updateRedirections(state, tabId);

    expect(getSessionRulesSpy).toHaveBeenCalled();
    expect(updateSessionRulesSpy).toHaveBeenCalledWith({
      removeRuleIds: [],
      addRules: [
        expect.objectContaining({
          condition: {
            urlFilter: scriptUrl,
            tabIds: [tabId],
          },
          action: {
            type: 'redirect',
            redirect: {
              url: scriptRedirect,
            }
          }
        }),
        expect.objectContaining({
          condition: {
            urlFilter: styleUrl,
            tabIds: [tabId],
          },
          action: {
            type: 'redirect',
            redirect: {
              url: styleRedirect,
            }
          }
        }),
      ],
    });
  });

  it('should remove the rules that are in the given tab', async () => {
    getSessionRulesSpy.mockResolvedValue([
      { id: 8888, condition: { tabIds: [tabId] }},
      { id: 8889, condition: { tabIds: [tabId] }},
      { id: 9999, condition: { tabIds: [43210] }},
    ]);

    await updateRedirections(state, tabId);

    expect(getSessionRulesSpy).toHaveBeenCalled();
    expect(updateSessionRulesSpy).toHaveBeenCalledWith({
      removeRuleIds: [8888, 8889],
      addRules: [
        expect.objectContaining({
          condition: {
            urlFilter: scriptUrl,
            tabIds: [tabId],
          },
          action: {
            type: 'redirect',
            redirect: {
              url: scriptRedirect,
            }
          }
        }),
        expect.objectContaining({
          condition: {
            urlFilter: styleUrl,
            tabIds: [tabId],
          },
          action: {
            type: 'redirect',
            redirect: {
              url: styleRedirect,
            }
          }
        }),
      ],
    });
  });
});
