chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    if (message.action === "target_clicked") {
      const elapsedTime = message.elapsedTime;
      document.getElementById("timer").textContent = elapsedTime + " ms";
    }
  }
);
