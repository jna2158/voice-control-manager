// 컨텐츠 스크립트 실행
export const ContentScriptService = (tabId) => {
  return chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["content/content.js"]
  });
}