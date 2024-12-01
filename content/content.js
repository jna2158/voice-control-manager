let recog = null;
let isRecognizing = false;

// 음성 인식 시작
const startRecognition = () => {
  const voiceButton = document.getElementById("voiceButton");
  const statusText = document.getElementById("status");

  voiceButton.textContent = "음성 인식 중지";
  statusText.textContent = "음성 인식 중...";

  if (!recog) {
    recog = new webkitSpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;

    recog.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      
      if (result.isFinal) {
        chrome.runtime.sendMessage({
          action: "transcriptResult",
          transcript: transcript
        });
      }
    };

    recog.onend = () => {
      if (isRecognizing) {
        recog.start();
      }
    };
  }

  recog.start();
  isRecognizing = true;
}

function stopRecognition() {
  if (recog) {
    recog.stop();
    isRecognizing = false;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startRecognition") {
    startRecognition();
  } else if (message.action === "stopRecognition") {
    stopRecognition();
  }
});