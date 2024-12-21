import { ContentScriptService } from "../../shared/service/content-script-service.js";
import { voiceRecognitionService } from "../../shared/service/voice-recognition.service.js";
import { UI_MESSAGES } from "../constants.js";

export const checkVoiceRecognition = () => {
  return "webkitSpeechRecognition" in window;
};

export const handleVoiceButtonClick = async (voiceButton, statusText) => {
  const [currentTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!currentTab || !currentTab.id) {
    throw new Error("유효하지 않은 탭 정보입니다.");
  }

  // 현재 인식 중이면 중지
  if (voiceRecognitionService.isRecognizing) {
    voiceRecognitionService.stop();
    voiceButton.textContent = UI_MESSAGES.START_RECOGNITION;
    statusText.textContent = UI_MESSAGES.WAITING;
    if (!currentTab.url.startsWith("chrome://")) {
      chrome.tabs.sendMessage(currentTab.id, { action: "stopRecognition" });
    }
    return;
  }

  try {
    if (!currentTab.url.startsWith("chrome://")) {
      await ContentScriptService(currentTab.id);
      const response = await chrome.tabs.sendMessage(currentTab.id, {
        action: "startRecognition",
      });
      if (!response || response.status !== "success") {
        throw new Error("Content Script 연결 실패");
      }
    }

    voiceButton.textContent = UI_MESSAGES.STOP_RECOGNITION;
    statusText.textContent = UI_MESSAGES.RECOGNIZING;

    voiceRecognitionService.start((result) => {
      statusText.textContent = `인식된 텍스트: ${result}`;
    });
  } catch (error) {
    console.error("음성 인식 시작 실패:", error);
    voiceButton.textContent = UI_MESSAGES.START_RECOGNITION;
    statusText.textContent = UI_MESSAGES.ERROR;
  }
};
