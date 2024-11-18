document.addEventListener("DOMContentLoaded", async () => {
  const voiceButton = document.getElementById("voiceButton");
  const statusText = document.getElementById("status");
  let isRecognizing = false; // 음성인식 실행중인지

  const isRecog = checkVoiceRecognition();
  if (!isRecog) {
    voiceButton.textContent = "이 브라우저는 음성 인식을 지원하지 않습니다.";
    voiceButton.disabled = true;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "ko-KR";
  recognition.continuous = true;
  recognition.interimResults = true;
  
  recognition.onstart = () => {
    console.log("음성인식이 시작됨");
    isRecognizing = true;
    voiceButton.textContent = "음성 인식 중지";
    statusText.textContent = "음성 인식 중...";
  };

  recognition.onresult = (event) => {
    console.log("음성인식 결과", event.results[0][0].transcript);
    const text = event.results[0][0].transcript;
    statusText.textContent = `인식된 텍스트: ${text}`;
  };

  recognition.onerror = (event) => {
    console.error("음성 인식 오류:", event.error);
    statusText.textContent = `오류 발생: ${event.error}`;
    isRecognizing = false;
    voiceButton.textContent = "음성 인식 시작";
  };

  recognition.onend = () => {
    console.log("음성 인식 종료");
    isRecognizing = false;
    voiceButton.textContent = "음성 인식 시작";
  };

  // voiceButton 클릭했을 때
  voiceButton.addEventListener("click", async () => {
    if (isRecognizing) {
      recognition.stop();
      return;
    }

    const permission = await checkMicPermission();
    await allowMicPermission(permission);
    recognition.start();
  });
});

// 해당 브라우저 음성 인식 지원하는지 확인
const checkVoiceRecognition = () => {
  if (("webkitSpeechRecognition" in window)) {
    return true;
  } return false;
};

// 마이크 권한 허용 여부 확인
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
  // 권한이 거부되었을 때
  if (permission === "denied") {
    goToMicSetting();
  }

  // 권한이 없는 경우
  if (permission === "prompt") {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    stream.getTracks().forEach(track => track.stop());
  }
};

// 마이크 권한 거부상태일 때 설정으로 이동
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