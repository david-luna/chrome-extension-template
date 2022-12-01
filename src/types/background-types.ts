export interface WebResource {
  type: chrome.webRequest.ResourceType;
  url: string;
  redirect?: string;
}

export interface TabState {
  resources: Record<string, WebResource>;
}

export interface BackgroundState {
  [tabId: number]: TabState;
  activeTab: number;
  popupTime: number;
}