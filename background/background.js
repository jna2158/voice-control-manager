let activeTabId = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'transcriptResult') {
    // 인식된 텍스트 처리
    console.log('Received transcript:', message.transcript);
    // 필요한 작업 수행
  }
});

chrome.action.onClicked.addListener((tab) => {
  activeTabId = tab.id;
});