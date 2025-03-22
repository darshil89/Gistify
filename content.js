chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "showSummary") {
        const div = document.createElement("div");
        div.innerText = "Summary: " + message.summary;
        div.style.cssText = "position:fixed;bottom:10px;right:10px;padding:10px;background:white;border:1px solid black;z-index:10000;";
        document.body.appendChild(div);
    }
});
