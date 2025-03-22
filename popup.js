document.getElementById("summarize-btn").addEventListener("click", () => {
    const text = document.getElementById("text-input").value;

    fetch("http://127.0.0.1:8000/process", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("summary-result").innerText = "Summary: " + data.summary;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("summary-result").innerText = "Failed to get summary.";
    });
});
