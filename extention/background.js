chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: showGreeting
    });
});

function showGreeting() {
    alert("Hello! This is your first extension.");
}