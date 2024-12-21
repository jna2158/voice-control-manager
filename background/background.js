import { voiceRecognitionService } from "../shared/service/voice-recognition.service.js";
import { commandHandlerService } from "../shared/service/command-service.js";

let activeTabId = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "transcriptResult") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        const wasCommandExecuted = await commandHandlerService.handleCommand(
          message.transcript,
          tabs[0].id
        );

        if (wasCommandExecuted) {
          chrome.runtime.sendMessage({
            action: "commandExecuted",
            command: message.transcript,
          });
        }
      }
    });
  }
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
    voiceRecognitionService.stop();
    sendResponse({ status: "success" });
  } else if (message.action === "transcriptResult") {
    console.log("Received transcript:", message.transcript);
  }
  return true;
});

chrome.action.onClicked.addListener((tab) => {
  activeTabId = tab.id;
});
