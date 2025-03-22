document.getElementById("summarizeBtn").addEventListener("click", async () => {
    const text = document.getElementById("userText").value.trim();
    if (!text) return alert("Please enter some text to summarize.");
  
    const response = await fetch("to be added", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
  
    const data = await response.json();
    document.getElementById("summary").innerText = "Summary: " + data.summary;
  });
  