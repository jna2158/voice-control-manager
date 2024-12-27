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
import { testOpenaiKey } from "../api/openai-key-test.js";
import { encryptApiKey } from "./utils/encryption-utils.js";
import { customAlert } from "./utils/alert-utils.js";
import {
  checkNetworkConnection,
  setupNetworkListeners,
} from "./utils/network-utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const voiceButton = document.getElementById("voiceButton");
  const statusText = document.getElementById("status");
  const voiceRecognitionUI = document.getElementById("voiceRecognitionUI");
  const modeSelection = document.getElementById("modeSelection");
  const showApiKeyInputBtn = document.getElementById("showApiKeyInput");
  const apiKeyInputDiv = document.getElementById("apiKeyInput");
  const apiKeySection = document.getElementById("apiKeySection");
  const basicModeBtn = document.getElementById("toggleApiKey");
  const saveApiKeyBtn = document.getElementById("saveApiKey");

  // 음성 인식 초기화 함수
  const initializeVoiceRecognition = async () => {
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
  };

  // 저장된 API 키 확인 및 초기 화면 설정
  const apiKey = await chrome.storage.local.get("openaiApiKey");
  if (apiKey.openaiApiKey) {
    // API 키가 존재하면 음성 인식 UI 표시
    modeSelection.classList.add("hidden");
    voiceRecognitionUI.classList.remove("hidden");
    initializeVoiceRecognition();
  } else {
    // API 키가 없으면 모드 선택 화면 표시
    modeSelection.classList.remove("hidden");
    voiceRecognitionUI.classList.add("hidden");
  }

  // API 키 등록하기 버튼 클릭
  showApiKeyInputBtn.addEventListener("click", () => {
    apiKeyInputDiv.classList.remove("hidden");
    apiKeySection.classList.add("hidden");
  });

  // 기본 모드 시작
  basicModeBtn.addEventListener("click", () => {
    modeSelection.classList.add("hidden");
    voiceRecognitionUI.classList.remove("hidden");
    initializeVoiceRecognition();
  });

  // API 키 저장 및 프리미엄 모드 시작
  saveApiKeyBtn.addEventListener("click", async () => {
    const apiKey = document.getElementById("openaiKey").value;
    if (apiKey.trim()) {
      const isValid = await testOpenaiKey(apiKey);
      if (!isValid) {
        customAlert(
          "API 키가 올바르지 않습니다. 키를 다시 확인해주세요.",
          "error",
          3000
        );
        return;
      }
      const encryptedKey = await encryptApiKey(apiKey);
      chrome.storage.local.set({ openaiApiKey: encryptedKey }, () => {
        modeSelection.classList.add("hidden");
        voiceRecognitionUI.classList.remove("hidden");
        initializeVoiceRecognition();
      });
    }
  });

  // 네트워크 상태 초기 체크
  if (!checkNetworkConnection()) {
    customAlert(
      "네트워크 연결이 없습니다. 연결 상태를 확인해주세요.",
      "warning"
    );
    voiceButton.disabled = true;
  }

  // 네트워크 상태 변경 감지
  setupNetworkListeners((isOnline) => {
    if (!isOnline) {
      customAlert(
        "네트워크 연결이 끊겼습니다. 연결 상태를 확인해주세요.",
        "warning"
      );
      voiceButton.disabled = true;
    } else {
      const alert = document.querySelector(".custom-alert.warning.show");
      alert.style.display = "none";
      voiceButton.disabled = false;
    }
  });
});
