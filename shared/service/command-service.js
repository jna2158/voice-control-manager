import { VOICE_COMMANDS } from "../constants/voice-commands.js";

const commands = new Map();

// 명령어 등록
const registerCommand = (commandType, action) => {
  commands.set(commandType, {
    config: VOICE_COMMANDS[commandType],
    action,
  });
};

const handleCommand = async (transcript, tabId) => {
  for (const [commandType, command] of commands.entries()) {
    if (command.config.match(transcript)) {
      console.log(`명령어 매칭 성공: ${commandType}`, {
        input: transcript,
        command: command.config,
      });
      return await command.action(tabId);
    }
  }

  console.log("매칭된 명령어 없음:", transcript);
  return false;
};

export const commandHandlerService = {
  registerCommand,
  handleCommand,
};

// 명령어 등록하기
commandHandlerService.registerCommand("REFRESH", async (tabId) => {
  await chrome.tabs.reload(tabId);
  return true;
});
