import { XhrExpress, XhrInterceptor } from './xhr';

interface RequestWithSpies {
  xhttp: XMLHttpRequest;
  spies: {
    setRequestHeader: jest.SpyInstance;
    readyStateChange: jest.SpyInstance;
  };
}

const createRequestWithSpies = (): RequestWithSpies => {
  const xhttp = new XMLHttpRequest();
  const readyStateChange = jest.fn();
  const setRequestHeader = jest.fn();

  // Make response writable
  Object.defineProperty(xhttp, "responseText", {writable: true});

  // @ts-ignore
  xhttp.responseText = 'Response from server';
  xhttp.onreadystatechange = readyStateChange;
  xhttp.setRequestHeader = setRequestHeader;
  xhttp.open('GET', 'https://contentsquare.com/api/', true);

  return { xhttp, spies: { setRequestHeader, readyStateChange } };
};

const setHeadersInterceptor: XhrInterceptor = {
  handle(xhr, next) {
    xhr.setRequestHeader('x-interceptor-header', 'true');
    next(xhr);
  },
};

const changeResponseInterceptor: XhrInterceptor = {
  handle(xhr, next) {
    // @ts-ignore
    xhr.responseText = 'Interceptor response';
  },
};

describe('XhrExpress', () => {
  const xhrOpenSpy = jest.fn();
  const xhrSendSpy = jest.fn();
  let expressXhr: XhrExpress;
  let requestWithSpies: RequestWithSpies;
  let originalOpen, originalSend;


  beforeEach(() => {
    originalOpen = window.XMLHttpRequest.prototype.open;
    originalSend = window.XMLHttpRequest.prototype.send;

    window.XMLHttpRequest.prototype.open = xhrOpenSpy;
    window.XMLHttpRequest.prototype.send = xhrSendSpy;

    expressXhr = new XhrExpress();
    requestWithSpies = createRequestWithSpies();
  })

  afterEach(() => {
    jest.resetAllMocks();
    window.XMLHttpRequest.prototype.open = originalOpen;
    window.XMLHttpRequest.prototype.send = originalSend;
  });
  
  it('should do a normal XHR if there is no interceptors used', () => {
    const { xhttp, spies } = requestWithSpies;
    
    xhttp.send();

    expect(spies.setRequestHeader).not.toHaveBeenCalled();
    expect(xhrSendSpy).toHaveBeenCalled();
  });

  it('should call the interceptor and then send the request', () => {
    const { xhttp, spies } = requestWithSpies;
    
    expressXhr
      .use(setHeadersInterceptor);

    xhttp.send();

    expect(spies.setRequestHeader).toHaveBeenCalledWith('x-interceptor-header', 'true');
    expect(xhrSendSpy).toHaveBeenCalled();
  });

  it('should call the interceptor and then not send the request if interceptor doesn\'t want to', () => {
    const { xhttp, spies } = requestWithSpies;
    
    expressXhr
      .use(changeResponseInterceptor);

    xhttp.send();

    expect(xhttp.responseText).toEqual('Interceptor response');
    expect(xhrSendSpy).not.toHaveBeenCalled();
  });

  it('should compose all interceptors', () => {
    const { xhttp, spies } = requestWithSpies;
    
    expressXhr
      .use(changeResponseInterceptor)
      .use(setHeadersInterceptor);

    xhttp.send();

    expect(spies.setRequestHeader).toHaveBeenCalledWith('x-interceptor-header', 'true');
    expect(xhttp.responseText).toEqual('Interceptor response');
    expect(xhrSendSpy).not.toHaveBeenCalled();
  });
});
