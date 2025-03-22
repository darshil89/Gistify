chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarize-text",
        title: "Summarize Text",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "summarize-text" && info.selectionText) {
        fetch("http://127.0.0.1:8000/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: info.selectionText })
        })
        .then(response => response.json())
        .then(data => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: showSummary,
                args: [data.summary]
            });
        });
    }
});

function showSummary(summary) {
    alert("Summary: " + summary);
}
