import { StartVoiceRecognition } from "../shared/utils/start-voice-recognition.js";
import { ContentScriptService } from "../shared/service/content-script-service.js";

document.addEventListener("DOMContentLoaded", async () => {
  const voiceButton = document.getElementById("voiceButton");
  const statusText = document.getElementById("status");

  if (!checkVoiceRecognition()) {
    voiceButton.textContent = "이 브라우저는 음성 인식을 지원하지 않습니다.";
    voiceButton.disabled = true;
    return;
  }

  // 백그라운드로부터 상태 업데이트 수신
  chrome.runtime.onMessage.addListener((message) => {
    switch (message.action) {
      case "recognitionStarted":
        voiceButton.textContent = "음성 인식 중지";
        statusText.textContent = "음성 인식 중...";
        break;
      case "recognitionResult":
        statusText.textContent = `인식된 텍스트: ${message.text}`;
        break;
      case "recognitionError":
        statusText.textContent = `오류 발생: ${message.error}`;
        voiceButton.textContent = "음성 인식 시작";
        break;
    }
  });

  // 음성 인식 버튼 클릭 이벤트
  voiceButton.addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
      const currentTab = tabs[0];
      
      if (currentTab.url.startsWith("chrome://newtab")) {
        // 새 탭에서는 팝업 창에서 직접 음성 인식 실행
        StartVoiceRecognition((result) => {
          const statusText = document.getElementById("status");
          statusText.textContent = `인식된 텍스트: ${result}`;
        });
      } else {
        await ContentScriptService(currentTab.id);
        chrome.tabs.sendMessage(currentTab.id, { action: "startRecognition" });
      }
    });
  });
});

// 브라우저가 음성지원 하는지 확인
const checkVoiceRecognition = () => {
  return "webkitSpeechRecognition" in window;
};

// 마이크 권한 확인
const checkMicPermission = async () => {
  try {
    const permissionStatus = await navigator.permissions.query({ name: "microphone" });
    return permissionStatus.state;
  } catch (err) {
    return err;
  }
};

// 마이크 권한 허용
const allowMicPermission = async (permission) => {
  if (permission === "denied") {
    goToMicSetting();
    return;
  }

  if (permission === "prompt") {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    stream.getTracks().forEach(track => track.stop());
  }
};

// 마이크 권한 거부시 설정 이동
const goToMicSetting = () => {
  const statusText = document.getElementById("status");
  statusText.textContent = "마이크 권한이 거부되었습니다. 설정으로 이동하시겠습니까?";
  const settingsLink = document.createElement("a");
  settingsLink.className = "settings-link";
  settingsLink.onclick = () => {
    chrome.tabs.create({
      url: "chrome://settings/content/microphone"
    });
  };
  settingsLink.textContent = "마이크 설정으로 이동 ->";
  statusText.appendChild(settingsLink);
};

