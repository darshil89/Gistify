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
            world: "MAIN", // ✅ Ensure access to DOM
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
    Object.assign(loadingDiv.style, {
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "black",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        zIndex: "9999",
        maxWidth: "300px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px"
    });

    // Create a close button (❌)
    const closeButton = document.createElement("button");
    closeButton.innerText = "❌";
    Object.assign(closeButton.style, {
        background: "transparent",
        border: "none",
        color: "white",
        cursor: "pointer",
        fontSize: "16px"
    });
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
