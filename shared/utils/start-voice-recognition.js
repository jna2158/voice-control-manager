let isRecognizing = false;
let recognition = null;

// 음성 인식 시작
export const StartVoiceRecognition = (callback) => {
  const voiceButton = document.getElementById("voiceButton");
  const statusText = document.getElementById("status");
  
  // 이미 음성 인식이 진행 중이라면 중지
  if (isRecognizing) {
    recognition.stop();
    voiceButton.textContent = "음성 인식 시작";
    statusText.textContent = "대기 중 ..";
    isRecognizing = false;
    return;
  }

  voiceButton.textContent = "음성 인식 중지";
  statusText.textContent = "음성 인식 중...";

  // 음성 인식 객체 생성
  if (!recognition) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
  }

  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1][0].transcript;
    if (callback) {
      callback(result);
    }
  }

  recognition.onerror = (event) => {
    statusText.textContent = `오류 발생: ${event.error}`;
    voiceButton.textContent = "음성 인식 시작";
    isRecognizing = false;
  };

  recognition.onend = () => {
    if (isRecognizing) { // 사용자가 직접 중지하지 않았는데 종료된 경우
      recognition.start(); // 다시 시작
    } else {
      voiceButton.textContent = "음성 인식 시작";
      statusText.textContent = "대기 중 ..";
    }
  };

  recognition.start();
  isRecognizing = true;
}
