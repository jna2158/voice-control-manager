import { VOICE_COMMANDS } from "../constants/voice-commands.js";

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
  for (const [commandType, command] of commands.entries()) {
    const { matched, matchResult } = checkIsCommandMaches(command, transcript);

    if (matched) {
      console.log(`명령어 매칭 성공: ${commandType}`, {
        input: transcript,
        command: command.config,
        matchResult,
      });
      return await command.action(tabId, matchResult);
    }
  }

  console.log("매칭된 명령어 없음:", transcript);
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
