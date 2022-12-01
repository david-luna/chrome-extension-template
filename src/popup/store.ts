import { get, readable, derived, writable, Writable } from 'svelte/store';
import { sendMessage } from '../messaging';
import { Message, MessageType, TabState } from '../types';


function createStore() {
	const { subscribe, set, update } = writable({ property: '' } as TabState);
  const updateFromBackgound = (message: Message<{ state: TabState, tabId: number }>) => {
    if(message.type === MessageType.CONFIG_UPDATE) {
      console.log('setting active config', message.payload.state);
      set(message.payload.state);
    }
  };

  // Connect with background updates
  chrome.runtime.onMessage.addListener(updateFromBackgound);
  // TODO: check when to unsubscribe
  // return () => {
  //   chrome.runtime.onMessage.removeListener(update);
  // };

	return {
		subscribe,
		reset: () => set({ property: '' }),
    setProperty: (value: string) => update(s => ({ ...s, property: value })),
  };
}

export const stateFacade = createStore();
