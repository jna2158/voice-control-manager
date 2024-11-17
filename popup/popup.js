document.addEventListener("DOMContentLoaded", () => {
  const voiceButton = document.getElementById("voiceButton");
  const statusText = document.getElementById("status");
  let isRecognizing = false;

  if (!("webkitSpeechRecognition" in window)) {
    voiceButton.textContent = "이 브라우저는 음성 인식을 지원하지 않습니다.";
    voiceButton.disabled = true;
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "ko-KR";
  recognition.continuous = true;
  recognition.interimResults = false;

  checkIsDenied();
  recognition.start();


  voiceButton.addEventListener("click", async () => {
    if (isRecognizing) {
      recognition.stop();
      return;
    }

    await checkIsDenied();
    recognition.start();
  });

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
});

// 마이크 권한 허용 여부 확인
const checkIsDenied = async () => {
  try {
    const permissionStatus = await navigator.permissions.query({ name: "microphone" });
    
    // 권한이 거부되었을 때
    if (permissionStatus.state === "denied") {
      isMicDenied();
    }

    // 권한이 없는 경우
    if (permissionStatus.state === "prompt") {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      stream.getTracks().forEach(track => track.stop());
    }
  } catch (err) {
    if (err.name === "NotAllowedError") {
      isMicDenied();
    } else {
      statusText.textContent = `오류가 발생했습니다: ${err.message}`;
    }
  }
};

// 마이크 권한 거부상태일 때 설정으로 이동
const isMicDenied = () => {
  statusText.textContent = "마이크 권한이 거부되었습니다. 설정으로 이동하시겠습니까?";
  const settingsLink = document.createElement("button");
  settingsLink.textContent = "마이크 설정으로 이동";
  settingsLink.onclick = () => {
    chrome.tabs.create({
      url: "chrome://settings/content/microphone"
    });
  };
  statusText.appendChild(settingsLink);
};