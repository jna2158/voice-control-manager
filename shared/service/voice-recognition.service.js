class VoiceRecognitionService {
  constructor() {
    this.recognition = null;
    this.isRecognizing = false;
    this.callback = null;
  }

  init() {
    if (!this.recognition) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    this.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1][0].transcript;
      if (this.callback) {
        this.callback(result);
      }
      chrome.runtime.sendMessage({
        action: "transcriptResult",
        transcript: result,
      });
    };

    this.recognition.onerror = (event) => {
      chrome.runtime.sendMessage({
        action: "recognitionError",
        error: event.error,
      });
      this.isRecognizing = false;
    };

    this.recognition.onend = () => {
      if (this.isRecognizing) {
        this.recognition.start();
      } else {
        chrome.runtime.sendMessage({ action: "recognitionEnded" });
      }
    };
  }

  start(callback) {
    this.init();
    if (this.isRecognizing) {
      this.stop();
      return;
    }
    this.callback = callback;
    this.recognition.start();
    this.isRecognizing = true;
    chrome.runtime.sendMessage({ action: "recognitionStarted" });
  }

  stop() {
    if (this.recognition) {
      this.recognition.stop();
      this.isRecognizing = false;
      chrome.runtime.sendMessage({ action: "recognitionStopped" });
    }
  }
}

export const voiceRecognitionService = new VoiceRecognitionService();
