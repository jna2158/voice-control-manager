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
  const voiceRecognitionUI = document.getElementById("voiceRecognitionUI");
  const modeSelection = document.getElementById("modeSelection");
  const showApiKeyInputBtn = document.getElementById("showApiKeyInput");
  const apiKeyInputDiv = document.getElementById("apiKeyInput");
  const apiKeySection = document.getElementById("apiKeySection");
  const basicModeBtn = document.getElementById("toggleApiKey");
  const saveApiKeyBtn = document.getElementById("saveApiKey");

  // 저장된 API 키 확인 및 초기 화면 설정
  const apiKey = await chrome.storage.local.get("openaiApiKey");
  if (apiKey.openaiApiKey) {
    // API 키가 존재하면 바로 음성 인식 UI 표시
    modeSelection.classList.add("hidden");
    voiceRecognitionUI.classList.remove("hidden");
    initializeVoiceRecognition();
  } else {
    // API 키가 없으면 모드 선택 화면 표시
    modeSelection.classList.remove("hidden");
    voiceRecognitionUI.classList.add("hidden");
  }

  // API 키 암호화
  const encryptApiKey = async (apiKey) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);

    // 암호화 키 생성
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    // 암호화
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    return {
      encrypted: Array.from(new Uint8Array(encryptedData)),
      iv: Array.from(iv),
      key: await exportCryptoKey(key),
    };
  };

  // 암호화 키 내보내기
  const exportCryptoKey = async (key) => {
    const exported = await crypto.subtle.exportKey("raw", key);
    return Array.from(new Uint8Array(exported));
  };

  // API 키 등록하기 버튼 클릭
  showApiKeyInputBtn.addEventListener("click", function () {
    apiKeyInputDiv.classList.remove("hidden");
    apiKeySection.classList.add("hidden");
  });

  // 기본 모드 시작
  basicModeBtn.addEventListener("click", function () {
    modeSelection.classList.add("hidden");
    voiceRecognitionUI.classList.remove("hidden");
    initializeVoiceRecognition();
  });

  // API 키 저장 및 프리미엄 모드 시작
  saveApiKeyBtn.addEventListener("click", async () => {
    const apiKey = document.getElementById("openaiKey").value;
    if (apiKey.trim()) {
      const encryptedKey = await encryptApiKey(apiKey);
      console.log("encryptedKey", encryptedKey);
      chrome.storage.local.set({ openaiApiKey: encryptedKey }, () => {
        modeSelection.classList.add("hidden");
        voiceRecognitionUI.classList.remove("hidden");
        initializeVoiceRecognition();
      });
    }
  });

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
});
