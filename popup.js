document.getElementById("summarize-btn").addEventListener("click", async () => {
    const loadingSpinner = document.getElementById("loading");
    const summaryText = document.getElementById("summary");

    // Show spinner and clear previous summary
    loadingSpinner.style.display = "block";
    summaryText.textContent = "";

    try {
        const response = await fetch("http://127.0.0.1:8000/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: "Your sample text goes here." }),
        });

        const data = await response.json();

        // Hide spinner and show summary
        loadingSpinner.style.display = "none";
        summaryText.textContent = data.summary;
    } catch (error) {
        loadingSpinner.style.display = "none";
        summaryText.textContent = "❌ Error fetching summary.";
        console.error("Error:", error);
    }
});
