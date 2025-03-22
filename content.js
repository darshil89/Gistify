document.addEventListener("mouseup", async () => {
    let selectedText = window.getSelection().toString().trim();
    if (!selectedText) return;

    // Remove any existing popup
    let existingPopup = document.getElementById("summary-popup");
    if (existingPopup) existingPopup.remove();

    // Create the popup
    let popup = document.createElement("div");
    popup.id = "summary-popup";
    Object.assign(popup.style, {
        position: "fixed",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        padding: "12px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
        width: "320px",
        fontFamily: "Arial, sans-serif",
        zIndex: "100000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
    });

    // Close button (❌)
    let closeButton = document.createElement("span");
    closeButton.innerText = "❌";
    Object.assign(closeButton.style, {
        position: "absolute",
        top: "8px",
        right: "10px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold"
    });
    closeButton.onclick = () => popup.remove();

    // Add loading spinner
    let spinner = document.createElement("div");
    spinner.style.width = "40px";
    spinner.style.height = "40px";
    spinner.style.border = "5px solid #ccc";
    spinner.style.borderTop = "5px solid #333";
    spinner.style.borderRadius = "50%";
    spinner.style.animation = "spin 1s linear infinite";
    
    let loadingText = document.createElement("p");
    loadingText.innerText = "Summarizing...";
    loadingText.style.margin = "10px 0";
    loadingText.style.fontSize = "14px";

    // Append elements
    popup.appendChild(closeButton);
    popup.appendChild(spinner);
    popup.appendChild(loadingText);
    document.body.appendChild(popup);

    // Fetch summarized text
    try {
        let response = await fetch("http://127.0.0.1:8000/process", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: selectedText })
        });

        let result = await response.json();
        
        // Replace content inside popup
        popup.innerHTML = `
            <span id="close-summary" style="position: absolute; top: 5px; right: 10px; cursor: pointer; font-size: 16px; font-weight: bold;">❌</span>
            <h3 style="margin: 5px 0; font-size: 16px;">Summary</h3>
            <p style="font-size: 14px; padding: 10px;">${result.summary}</p>
        `;

        // Attach close event to new ❌ button
        document.getElementById("close-summary").onclick = () => popup.remove();

    } catch (error) {
        popup.innerHTML = `
            <span id="close-summary" style="position: absolute; top: 5px; right: 10px; cursor: pointer; font-size: 16px; font-weight: bold;">❌</span>
            <p style="color: red;">❌ Error summarizing text</p>
        `;
        document.getElementById("close-summary").onclick = () => popup.remove();
    }
});

// Add spinner CSS
let style = document.createElement("style");
style.innerHTML = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);
