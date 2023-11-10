chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "getTabs") {
    chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
      chrome.tabs.query({ windowId: currentWindow.id }, function (tabs) {
        sendResponse({ tabs: tabs });
      });
    });
  } else if (request.action == "switchTab") {
    chrome.tabs.update(request.tabId, { active: true });
  }
  return true; // Keep the message channel open for the response
});
