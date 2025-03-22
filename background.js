chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarizeText",
        title: "Summarize this text",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "summarizeText") {
        const text = info.selectionText;

        const response = await fetch("http://localhost:8000/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const result = await response.json();
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "Text Summary",
            message: `📌 Classification: ${result.classification}\n📌 Entities: ${result.entities.join(", ")}\n📌 Summary: ${result.summary}`
        });
    }
});
