chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "summarize",
      title: "Summarize Selected Text",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "summarize") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: summarizeText,
        args: [info.selectionText]
      });
    }
  });
  
  async function summarizeText(selectedText) {
    const apiUrl = "to be added";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: selectedText })
    });
  
    const data = await response.json();
    alert(`Summary: ${data.summary}`);
  }
  