chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "getTabs") {
    chrome.windows.getCurrent({ populate: true }, (currentWindow) => {
      chrome.tabs.query({ windowId: currentWindow.id }, function (tabs) {
        sendResponse({ tabs: tabs });
      });
    });
  } else if (request.action == "switchTab") {
    chrome.tabs.update(request.tabId, { active: true });
  } else if (request.action === "closeTab") {
    chrome.tabs.remove(request.tabId);
  }
  return true; // Keep the message channel open for the response
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "openGoogle") {
    chrome.tabs.create({ url: request.url });
  }
});
