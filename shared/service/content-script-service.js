export const ContentScriptService = async (tabId) => {
  try {
    const tab = await chrome.tabs.get(tabId);

    if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
      throw new Error("브라우저 시스템 페이지에서는 실행할 수 없습니다");
    }

    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content/content.js"],
      injectImmediately: true,
    });
  } catch (error) {
    console.error("스크립트 주입 실패:", error);
    throw error;
  }
};
