import { stateFacade } from './state';

/**
 * Detects requests to script or stylesheets and add them to the state
 *
 * @param details web request details
 */
export function loaderInterceptor(details: chrome.webRequest.WebRequestBodyDetails): void {
  const { url, type, tabId } = details;

  if (type !== 'script' && type !== 'stylesheet') {
    return;
  }

  stateFacade.setWebResource({ type, url }, tabId);
};
