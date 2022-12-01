export type PatchedXMLHttpRequest = XMLHttpRequest & {
  _url: string;
  _sendArguments: unknown[];
  _listeners: { eventName}
};
export type NextXhrHandler = (xhr: PatchedXMLHttpRequest) => void;
export interface XhrInterceptor {
  handle (xhr: PatchedXMLHttpRequest, next: (xhr: PatchedXMLHttpRequest) => void): void,
}

/**
 * Provides an express like API to handle XHR requests by monkey patching the prototype
 */
export class XhrExpress {
  private slots: Array<{ interceptor: XhrInterceptor; next: NextXhrHandler }> = [];

  constructor () {
    // https://stackoverflow.com/questions/23901337/overwriting-xmlhttprequest-responsetext
    const xmlHttpOpen = window.XMLHttpRequest.prototype.open;
    const xmlHttpSend = window.XMLHttpRequest.prototype.send;

    // Jsut calls through the original API with the satashed arguments
    const defaultInterceptor: XhrInterceptor = {
      handle: (xhr) => {
        return xmlHttpSend.apply(xhr, xhr._sendArguments);
      }
    };

    window.XMLHttpRequest.prototype.open = function (this: PatchedXMLHttpRequest) {
      this._url = arguments[1];
      return xmlHttpOpen.apply(this, [].slice.call(arguments));
    };
    
    window.XMLHttpRequest.prototype.send = function(this: PatchedXMLHttpRequest) {
      this._sendArguments = [].slice.call(arguments);
      const firstSlot = slots[slots.length - 1];
      const firstInterceptor = firstSlot.interceptor;
      const firstNext = firstSlot.next;

      return firstInterceptor.handle(this, firstNext);
    };

    const slots = this.slots;
    this.slots.push({ interceptor: defaultInterceptor, next: () => void 0 });
  }

  /**
   * Add an interceptor for requests
   *
   * @param interceptor the intercpetor to add (last one is the 1st to be used)
   */
  use(interceptor: XhrInterceptor) {
    const lastSlot = this.slots[this.slots.length - 1];
    const nextInterceptor = lastSlot.interceptor;
    const nextHandler = lastSlot.next;
    const next = function (xhr) {
      return nextInterceptor.handle(xhr, nextHandler);
    };

    this.slots.push({ interceptor, next });
    return this;
  }
}

