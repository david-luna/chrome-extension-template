import { BackgroundState, WebResource } from '../types';
import { hashCode } from '../utils/hash-code';
import { stateFacade } from './state';

describe('stateFacade', () => {
  let lastState: BackgroundState;
  const firstTab = 123456789;
  const secondTab = 98765321;
  const resource: WebResource = { type: 'script', url: 'https://domain.com/script.js' };
  const resourceHash = hashCode(resource.url);
  const unsubscribe = stateFacade.subscribe((state) => lastState = state);

  afterEach(() => {
    stateFacade.reset();
  });

  afterAll(() => {
    unsubscribe();
  });

  describe('setActiveTab', () => {
    it('should set the value of the active tab', () => {
      stateFacade.setActiveTab(1);

      expect(lastState).toEqual({ activeTab: 1 });
    });
  });

  describe('removeTab', () => {
    it('should remove the config of a tab', () => {
      stateFacade.setWebResource(resource, firstTab);

      expect(lastState[firstTab]).toBeTruthy();

      stateFacade.removeTab(firstTab);
      expect(lastState[firstTab]).toBeNull();
    });
  });

  describe('setWebResource', () => {
    it('should set a resource in the state of the given tab', () => {
      stateFacade.setWebResource(resource, firstTab);

      expect(lastState).toEqual(expect.objectContaining({
        [firstTab]: { resources: { [resourceHash]: resource } },
      }));
    });

    it('should set a resource in the state for more than one tab', () => {
      stateFacade.setWebResource(resource, firstTab);
      stateFacade.setWebResource(resource, secondTab);

      expect(lastState).toEqual(expect.objectContaining({
        [firstTab]: { resources: { [resourceHash]: resource } },
        [secondTab]: { resources: { [resourceHash]: resource } },
      }));
    });
  });

});
