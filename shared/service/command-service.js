import { VOICE_COMMANDS } from "../constants/voice-commands.js";
import { openai } from "../../api/openai.js";

const commands = new Map();

// 명령어 등록
const registerCommand = (commandType, action) => {
  commands.set(commandType, {
    config: VOICE_COMMANDS[commandType],
    action,
  });
};

// 명령어 처리
const handleCommand = async (transcript, tabId) => {
  if (!transcript || transcript.length === 0) return false;

  for (const [commandType, command] of commands.entries()) {
    const { matched, matchResult } = checkIsCommandMaches(command, transcript);

    if (matched) {
      console.log(`!! 키워드 매칭 성공: ${commandType}`, {
        input: transcript,
        command: command.config,
        matchResult,
      });
      return await command.action(tabId, matchResult);
    }
  }

  const commandResult = await openai(transcript);
  if (commandResult) {
    console.log(`!! OpenAI 매칭 성공: ${commandResult}`);

    const { commandType, ...params } = commandResult;
    const command = commands.get(commandType);

    if (command) {
      return await command.action(tabId, params);
    }
  }

  console.log("!! 매칭된 명령어 없음:", transcript);
  return false;
};

// 명령어 매칭 여부 확인
const checkIsCommandMaches = (command, transcript) => {
  const matchResult = command.config.match(transcript);

  if (!matchResult) return { matched: false };
  return { matched: true, matchResult };
};

export const commandHandlerService = {
  registerCommand,
  handleCommand,
};

// 명령어 등록하기
commandHandlerService.registerCommand("REFRESH", async (tabId) => {
  console.log("REFRESH 명령어 실행");
  await chrome.tabs.reload(tabId);
  return true;
});

commandHandlerService.registerCommand("SEARCH", async (tabId, matchResult) => {
  console.log("SEARCH 명령어 실행", matchResult);
  if (matchResult.searchTerm) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      matchResult.searchTerm
    )}`;
    await chrome.tabs.update(tabId, { url: searchUrl });
  }
  return true;
});

commandHandlerService.registerCommand("SCROLL_TOP", async (tabId) => {
  console.log("SCROLL_TOP 명령어 실행");
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      window.scrollTo(0, 0);
    },
  });
  return true;
});

commandHandlerService.registerCommand("SCROLL_BOTTOM", async (tabId) => {
  console.log("SCROLL_BOTTOM 명령어 실행");
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      window.scrollTo(0, document.body.scrollHeight);
    },
  });
  return true;
});

commandHandlerService.registerCommand("SCROLL_UP", async (tabId) => {
  console.log("SCROLL_UP 명령어 실행");
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      window.scrollBy(0, -window.innerHeight * 0.7);
    },
  });
  return true;
});

commandHandlerService.registerCommand("SCROLL_DOWN", async (tabId) => {
  console.log("SCROLL_DOWN 명령어 실행");
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      window.scrollBy(0, window.innerHeight * 0.7);
    },
  });
  return true;
});

commandHandlerService.registerCommand("GO_BACK", async (tabId) => {
  console.log("GO_BACK 명령어 실행");
  await chrome.tabs.goBack(tabId);
  return true;
});

commandHandlerService.registerCommand("GO_FORWARD", async (tabId) => {
  console.log("GO_FORWARD 명령어 실행");
  await chrome.tabs.goForward(tabId);
  return true;
});

commandHandlerService.registerCommand("ZOOM_IN", async (tabId) => {
  console.log("ZOOM_IN 명령어 실행");
  await chrome.tabs.getZoom(tabId).then(async (zoomFactor) => {
    await chrome.tabs.setZoom(tabId, zoomFactor + 0.1);
  });
  return true;
});

commandHandlerService.registerCommand("ZOOM_OUT", async (tabId) => {
  console.log("ZOOM_OUT 명령어 실행");
  await chrome.tabs.getZoom(tabId).then(async (zoomFactor) => {
    await chrome.tabs.setZoom(tabId, zoomFactor - 0.1);
  });
  return true;
});

commandHandlerService.registerCommand("CLOSE_TAB", async (tabId) => {
  console.log("CLOSE_TAB 명령어 실행");
  await chrome.tabs.remove(tabId);
  return true;
});

commandHandlerService.registerCommand(
  "CLICK_LINK",
  async (tabId, matchResult) => {
    console.log("CLICK_LINK 명령어 실행", matchResult);
    const result = await chrome.scripting.executeScript({
      target: { tabId },
      func: (linkText) => {
        const searchResults = document.getElementById("search");
        if (!searchResults)
          return { success: false, error: "해당되는 링크가 없습니다." };

        const links = Array.from(searchResults.querySelectorAll("a")).filter(
          (link) => {
            const rect = link.getBoundingClientRect();
            const activeLink =
              rect.width > 0 &&
              rect.height > 0 &&
              link.offsetParent !== null &&
              window.getComputedStyle(link).display !== "none" &&
              window.getComputedStyle(link).visibility !== "hidden" &&
              link.textContent.trim() !== "";

            return activeLink;
          }
        );

        const targetLink = links.find((link) =>
          link.textContent.toLowerCase().includes(linkText.toLowerCase())
        );

        if (targetLink) {
          targetLink.click();
          return { success: true };
        }
        return { success: false, error: "해당되는 링크가 없습니다." };
      },
      args: [matchResult.linkText],
    });
    return true;
  }
);
