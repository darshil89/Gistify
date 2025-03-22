chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "summarizeText",
        title: "Summarize Text",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "summarizeText") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: summarizeSelectedText,
            args: [info.selectionText]
        });
    }
});

async function summarizeSelectedText(text) {
    if (!text) return;
    
    const loadingDiv = document.createElement("div");
    loadingDiv.innerText = "🔄 Summarizing...";
    loadingDiv.style.position = "fixed";
    loadingDiv.style.top = "10px";
    loadingDiv.style.right = "10px";
    loadingDiv.style.background = "black";
    loadingDiv.style.color = "white";
    loadingDiv.style.padding = "10px";
    loadingDiv.style.borderRadius = "5px";
    loadingDiv.style.zIndex = "9999";
    document.body.appendChild(loadingDiv);

    try {
        const response = await fetch("http://127.0.0.1:8000/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const data = await response.json();
        loadingDiv.innerText = `✅ Summary: ${data.summary}`;

        setTimeout(() => {
            loadingDiv.remove();
        }, 5000);
    } catch (error) {
        loadingDiv.innerText = "❌ Error summarizing text";
        console.error(error);

        setTimeout(() => {
            loadingDiv.remove();
        }, 5000);
    }
}
