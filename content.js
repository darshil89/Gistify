document.addEventListener("mouseup", () => {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        showTemporaryPopup(selectedText);
    }
});

function showTemporaryPopup(text) {
    // Remove existing temp popup
    let existingTempPopup = document.getElementById("tempPopup");
    if (existingTempPopup) existingTempPopup.remove();

    let tempPopup = document.createElement("div");
    tempPopup.id = "tempPopup";
    tempPopup.innerText = "📌 Text Selected!";
    tempPopup.style.position = "fixed";
    tempPopup.style.bottom = "20px";
    tempPopup.style.right = "20px";
    tempPopup.style.background = "gray";
    tempPopup.style.color = "white";
    tempPopup.style.padding = "8px";
    tempPopup.style.borderRadius = "5px";
    tempPopup.style.zIndex = "9999";
    tempPopup.style.fontSize = "14px";

    document.body.appendChild(tempPopup);

    // Remove the popup on click anywhere
    document.addEventListener("click", () => {
        if (tempPopup) tempPopup.remove();
    }, { once: true });
}

async function summarizeSelectedText(text) {
    if (!text) return;

    // Remove only the summary popup, not the temp popup
    let existingSummaryPopup = document.getElementById("summaryPopup");
    if (existingSummaryPopup) existingSummaryPopup.remove();

    let summaryPopup = document.createElement("div");
    summaryPopup.id = "summaryPopup";
    summaryPopup.innerText = "🔄 Summarizing...";
    summaryPopup.style.position = "fixed";
    summaryPopup.style.top = "10px";
    summaryPopup.style.right = "10px";
    summaryPopup.style.background = "black";
    summaryPopup.style.color = "white";
    summaryPopup.style.padding = "10px";
    summaryPopup.style.borderRadius = "5px";
    summaryPopup.style.zIndex = "9999";
    summaryPopup.style.maxWidth = "300px";
    summaryPopup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";

    let closeButton = document.createElement("button");
    closeButton.innerText = "❌";
    closeButton.style.background = "transparent";
    closeButton.style.border = "none";
    closeButton.style.color = "white";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "16px";
    closeButton.onclick = () => summaryPopup.remove();

    summaryPopup.appendChild(closeButton);
    document.body.appendChild(summaryPopup);

    try {
        let response = await fetch("http://127.0.0.1:8000/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        let data = await response.json();
        summaryPopup.innerText = `✅ Summary: ${data.summary}`;
        summaryPopup.appendChild(closeButton);

    } catch (error) {
        summaryPopup.innerText = "❌ Error summarizing text";
        summaryPopup.appendChild(closeButton);
        console.error(error);
    }
}
