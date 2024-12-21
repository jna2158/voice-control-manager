import { VOICE_COMMANDS } from "../constants/voice-commands.js";

const commands = [];

const registerCommand = (keywords, action) => {
  commands.push({ keywords, action });
};

const handleCommand = async (transcript, tabId) => {
  const matchedCommand = commands.find((command) =>
    command.keywords.some((keyword) => transcript.includes(keyword))
  );

  // 일치하는 명령어가 있으면 실행
  if (matchedCommand) {
    return await matchedCommand.action(tabId);
  }

  return false;
};

export const commandHandlerService = {
  registerCommand,
  handleCommand,
};

// 명령어 리스트 등록
commandHandlerService.registerCommand(VOICE_COMMANDS.REFRESH, async (tabId) => {
  console.log("새로고침 명령어 실행");
  await chrome.tabs.reload(tabId);
  return true;
});
