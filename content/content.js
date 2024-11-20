let recognition = null;
let isRecognizing = false;

function startRecognition() {
  if (!recognition) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      
      if (result.isFinal) {
        chrome.runtime.sendMessage({
          action: 'transcriptResult',
          transcript: transcript
        });
      }
    };

    recognition.onend = () => {
      if (isRecognizing) {
        recognition.start();
      }
    };
  }

  recognition.start();
  isRecognizing = true;
}

function stopRecognition() {
  if (recognition) {
    recognition.stop();
    isRecognizing = false;
  }
}
console.log("content loaded !!!");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRecognition') {
    startRecognition();
  } else if (message.action === 'stopRecognition') {
    stopRecognition();
  }
});