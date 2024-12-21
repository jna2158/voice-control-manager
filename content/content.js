chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startRecognition") {
    try {
      sendResponse({ status: "success" });
      chrome.runtime.sendMessage({ action: "startVoiceRecognition" });
    } catch (error) {
      console.error("메시지 처리 중 오류:", error);
      sendResponse({ status: "error", error: error.message });
    }
    return true;
  }
});
