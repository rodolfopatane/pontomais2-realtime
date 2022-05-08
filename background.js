chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
    chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        files: ["main.js"],
    });
}, {
    url: [{
        hostEquals: "app2.pontomais.com.br"
    }]
});