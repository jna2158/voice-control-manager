import { voiceRecognitionService } from "../shared/service/voice-recognition.service.js";
import { commandHandlerService } from "../shared/service/command-service.js";

let activeTabId = null; // 현재 활성화된 탭 ID
let lastTranscriptTimeout = null; // 타이머 ID

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 음성 인식 시작
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
  }

  // 음성 인식 결과 받음
  if (message.action === "transcriptResult") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]) {
        if (lastTranscriptTimeout) {
          clearTimeout(lastTranscriptTimeout);
        }

        // 새로운 타이머 설정
        lastTranscriptTimeout = setTimeout(async () => {
          const wasCommandExecuted = await commandHandlerService.handleCommand(
            message.transcript.replace(/\s+/g, ""),
            tabs[0].id
          );

          if (wasCommandExecuted) {
            chrome.runtime.sendMessage({
              action: "commandExecuted",
              command: message.transcript,
            });
          }
          lastTranscriptTimeout = null;
        }, 1000);
      }
    });
  }

  // 음성 인식 중지
  if (message.action === "stopVoiceRecognition") {
    voiceRecognitionService.stop();
    sendResponse({ status: "success" });
  }
  return true;
});

chrome.action.onClicked.addListener((tab) => {
  activeTabId = tab.id;
});
