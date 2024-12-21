import { voiceRecognitionService } from "../shared/service/voice-recognition.service.js";

let activeTabId = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startVoiceRecognition") {
    try {
      voiceRecognitionService.start((result) => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "transcriptResult",
          transcript: result,
        });
      });
      sendResponse({ success: true });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    return true;
  } else if (message.action === "stopVoiceRecognition") {
    console.log("음성 인식 중지");
    voiceRecognitionService.stop();
    sendResponse({ status: "success" });
  } else if (message.action === "transcriptResult") {
    console.log("Received transcript:", message.transcript);
  }
  return true; // 비동기 응답을 위해 필요
});

chrome.action.onClicked.addListener((tab) => {
  activeTabId = tab.id;
});
