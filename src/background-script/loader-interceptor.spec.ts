import { stateFacade } from './state';
import { loaderInterceptor } from './loader-interceptor';

describe("loading interceptors", () => {
  const scriptUrl = 'https://domain.com/path/to/script.js';
  const styleUrl = 'https://domain.com/path/to/style.css';
  const tabId = 123456789;
    
  const setWebResourceSpy = jest.spyOn(stateFacade, 'setWebResource');

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("loaderInterceptor", () => {
    it('should do nothing if the request is not of type script or stylesheet', () => {
      const details = { type: 'image', url: 'any', tabId } as unknown as chrome.webRequest.WebRequestBodyDetails;
  
      loaderInterceptor(details);
  
      expect(setWebResourceSpy).not.toHaveBeenCalled();
    });

    it('should call setWebResource if the request is for a script', () => {
      const type = 'script';
      const url = scriptUrl;
      const details = { type, url, tabId } as unknown as chrome.webRequest.WebRequestBodyDetails;
  
      loaderInterceptor(details);
  
      expect(setWebResourceSpy).toHaveBeenCalledWith({type, url}, tabId);
    });

    it('should call setWebResource if the request is for a stylesheet', () => {
      const type = 'stylesheet';
      const url = styleUrl;
      const details = { type, url, tabId } as unknown as chrome.webRequest.WebRequestBodyDetails;
  
      loaderInterceptor(details);
  
      expect(setWebResourceSpy).toHaveBeenCalledWith({type, url}, tabId);
    });
  });
});