import { get, writable } from 'svelte/store';
import { BackgroundState, MessageType, TabState, WebResource } from '../types';
import { hashCode } from '../utils/hash-code';


function initTab(tabId: number, state: BackgroundState): BackgroundState {
  const emptyConfig = { resources: {} };
  return { ...state, [tabId]: state[tabId] || emptyConfig }
}

function createStore() {
	const { subscribe, set, update } = writable({ activeTab: 0 } as BackgroundState);

	return {
		subscribe,
		reset: () => set({ activeTab: 0, popupTime: 0 }),
    setActiveTab: (tabId: number) => update(s => ({ ...s, activeTab: tabId })),
    setPopupTimestamp: (time: number) => update(s => ({ ...s, popupTime: time })),
    removeTab: (tabId: number) => update(s => ({ ...s, [tabId]: null })),
    setWebResource(resource: WebResource, tabId: number) {
      update((prevState) => {
        const nextState = initTab(tabId, prevState);
        const tabState = nextState[tabId];
        const hash = hashCode(resource.url);

        tabState.resources[hash] = resource;
        return nextState;
      });
    },
    overrideActiveTabState(tabState: TabState) {
      update((state) => ({ ...state, [state.activeTab]: tabState }));
    }
	};
}

export const stateFacade = createStore();
