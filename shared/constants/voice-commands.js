export const VOICE_COMMANDS = {
  REFRESH: {
    keywords: ["새로고침", "새로 고침"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords } = VOICE_COMMANDS.REFRESH;
      return keywords.some((keyword) => transcript.includes(keyword));
    },
  },
};
