import { TabState, WebResource } from "../types";

let ruleIdCounter = 1;

function updateRulesCounter (rules: chrome.declarativeNetRequest.Rule[]): chrome.declarativeNetRequest.Rule[] {
  const ruleIds = [...rules.map((rule) => rule.id), ruleIdCounter];

  ruleIdCounter = Math.max(...ruleIds) + 1;

  return rules;
}
/**
 * 
 * @param resources the resources entries to transform
 * @returns an array of redirection rules
 */
function resourcesToRules(resources: TabState['resources'], tabId: number): chrome.declarativeNetRequest.Rule[] {
  return Object.values(resources)
    .filter((resource) => !!resource.redirect)
    .map((resource) => {
      return {
        id: ++ruleIdCounter,
        condition: {
          urlFilter: resource.url,
          tabIds: [tabId],
        },
        action: {
          type: 'redirect' as chrome.declarativeNetRequest.RuleActionType.REDIRECT,
          redirect: {
            url: resource.redirect,
          },
        },
      };
    });
}

/**
 * Erases al redirections and regenerates them from the current state
 * 
 * @param config The configuraitno to take into account
 * @param tabId the ID of the tab which the config belongs to
 */
export function updateRedirections(state: TabState, tabId: number): Promise<void> {
  return chrome.declarativeNetRequest.getSessionRules()
  .then(updateRulesCounter)
  .then((rules) => rules.filter((rule) => rule.condition.tabIds?.some(tid => tid === tabId)))
  .then((rules) => rules.map((rule) => rule.id))
  .then((removeRuleIds) => {
    const addRules = resourcesToRules(state.resources, tabId)

    return chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds, addRules });
  });
}
