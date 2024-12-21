import {
  checkMicPermission,
  allowMicPermission,
} from "./permissions/mic-permission.js";
import { updateUIStatus } from "./handlers/ui-handler.js";
import {
  checkVoiceRecognition,
  handleVoiceButtonClick,
} from "./handlers/voice-recognition-handler.js";
import { UI_MESSAGES } from "./constants.js";

document.addEventListener("DOMContentLoaded", async () => {
  const voiceButton = document.getElementById("voiceButton");
  const statusText = document.getElementById("status");

  // 초기 마이크 권한 확인
  const micPermission = await checkMicPermission();
  await allowMicPermission(micPermission);

  // 음성인식 지원 안한다면
  if (!checkVoiceRecognition()) {
    voiceButton.textContent = UI_MESSAGES.BROWSER_NOT_SUPPORTED;
    voiceButton.disabled = true;
    return;
  }

  // 백그라운드로부터 상태 업데이트 수신
  chrome.runtime.onMessage.addListener((message) => {
    updateUIStatus(message, voiceButton, statusText);
  });

  // 음성 인식 버튼 클릭 이벤트
  voiceButton.addEventListener("click", () =>
    handleVoiceButtonClick(voiceButton, statusText)
  );
});
