chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.url.includes("facebook.com")) {
      chrome.tabs.sendMessage(details.tabId, { action: "collectUserData" });
    }
  }, { url: [{ urlMatches: 'facebook.com' }] });
  