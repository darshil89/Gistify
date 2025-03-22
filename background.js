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
    
    // Remove existing popup if present
    const existingPopup = document.getElementById("summaryPopup");
    if (existingPopup) existingPopup.remove();

    // Create the summary container
    const loadingDiv = document.createElement("div");
    loadingDiv.id = "summaryPopup";
    loadingDiv.innerText = "🔄 Summarizing...";
    loadingDiv.style.position = "fixed";
    loadingDiv.style.top = "10px";
    loadingDiv.style.right = "10px";
    loadingDiv.style.background = "black";
    loadingDiv.style.color = "white";
    loadingDiv.style.padding = "10px";
    loadingDiv.style.borderRadius = "5px";
    loadingDiv.style.zIndex = "9999";
    loadingDiv.style.maxWidth = "300px";
    loadingDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    loadingDiv.style.display = "flex";
    loadingDiv.style.alignItems = "center";
    loadingDiv.style.justifyContent = "space-between";
    loadingDiv.style.gap = "10px";

    // Create a close button (❌)
    const closeButton = document.createElement("button");
    closeButton.innerText = "❌";
    closeButton.style.background = "transparent";
    closeButton.style.border = "none";
    closeButton.style.color = "white";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "16px";
    closeButton.onclick = () => loadingDiv.remove();

    // Append elements
    loadingDiv.appendChild(closeButton);
    document.body.appendChild(loadingDiv);

    try {
        const response = await fetch("http://127.0.0.1:8000/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const data = await response.json();
        loadingDiv.innerText = `✅ Summary: ${data.summary}`;
        loadingDiv.appendChild(closeButton); // Reattach the close button

    } catch (error) {
        loadingDiv.innerText = "❌ Error summarizing text";
        loadingDiv.appendChild(closeButton);
        console.error(error);
    }
}
