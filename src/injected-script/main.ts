import { ExtensionMessage, MessageType } from '../types';
import { XhrExpress } from './xhr';
import {
  inspectResponseTextInterceptor,
  setExtraRequestHeaderInterceptor,
  setExtraResponseHeaderInterceptor
} from './sample-interceptors';

// Intercept request to exchange data
const xhrExpress = new XhrExpress();

xhrExpress
  .use(inspectResponseTextInterceptor)
  .use(setExtraResponseHeaderInterceptor)
  .use(setExtraRequestHeaderInterceptor);


// Listen for content script messages
window.addEventListener('message', (event) => {
  const message  = event.data as ExtensionMessage;
  switch (message.type) {
    // TODO: actions here
  }
});
