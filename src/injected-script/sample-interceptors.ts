import { MessageType } from "../types";
import { PatchedXMLHttpRequest, XhrInterceptor } from './xhr';

interface UserInfo {
  email: string;
}

// We want to use native APIs instead of monkey patched ones
const nativeFetch = window.fetch;


/**
 * To set something before send
 */
export const setExtraRequestHeaderInterceptor: XhrInterceptor = {
  handle: function (xhr, next) {
    // Set a header
    xhr.setRequestHeader('x-xhr-express', `${Date.now()}`);
    // call through (must do it always)
    next(xhr);
  }
};


/**
 * To return an extra header in the response
 */
export const setExtraResponseHeaderInterceptor: XhrInterceptor = {
  handle: function (xhr, next) {
    const getAllResponseHeaders = xhr.getAllResponseHeaders;

    xhr.getAllResponseHeaders = function () {
      const headers = getAllResponseHeaders.apply(xhr, arguments);

      return `${headers}x-xhr-express: ${Date.now()}`;
    };
    // call through (must do it always)
    next(xhr);
  }
};

/**
 * Logs the response
 */
export const inspectResponseTextInterceptor: XhrInterceptor = {
  handle: function (xhr, next) {
    // Attach a listener
    xhr.addEventListener('readystatechange', function (this: PatchedXMLHttpRequest) {
      if (this.readyState === this.DONE && this.status === 200) {
        console.log('got respose', this.responseText);
      }
    });
    // call through (must do it always)
    next(xhr);
  }
};
