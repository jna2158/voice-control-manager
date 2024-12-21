import { UI_MESSAGES } from "../constants.js";

const UI_STATUS_HANDLERS = {
  recognitionStarted: (voiceButton, statusText) => {
    voiceButton.textContent = UI_MESSAGES.STOP_RECOGNITION;
    statusText.textContent = UI_MESSAGES.RECOGNIZING;
  },
  recognitionStopped: (voiceButton, statusText) => {
    voiceButton.textContent = UI_MESSAGES.START_RECOGNITION;
    statusText.textContent = UI_MESSAGES.WAITING;
  },
  recognitionEnded: (voiceButton, statusText) => {
    voiceButton.textContent = UI_MESSAGES.START_RECOGNITION;
    statusText.textContent = UI_MESSAGES.WAITING;
  },
  recognitionResult: (voiceButton, statusText, message) => {
    statusText.textContent = `인식된 텍스트: ${message.text}`;
  },
  recognitionError: (voiceButton, statusText, message) => {
    statusText.textContent = `오류 발생: ${message.error}`;
    voiceButton.textContent = UI_MESSAGES.START_RECOGNITION;
  },
};

// UI 상태 업데이트
export const updateUIStatus = (message, voiceButton, statusText) => {
  const handler = UI_STATUS_HANDLERS[message.action];
  if (handler) {
    handler(voiceButton, statusText, message);
  }
};
