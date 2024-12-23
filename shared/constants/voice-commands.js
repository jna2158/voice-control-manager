export const VOICE_COMMANDS = {
  REFRESH: {
    keywords: ["새로고침", "새로 고침"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.REFRESH;
      const hasBlockingKeyword = blockingKeywords.some((keyword) =>
        transcript.includes(keyword)
      );

      // 차단 키워드가 있으면 명령어 처리 안함
      if (hasBlockingKeyword) {
        return false;
      }

      return keywords.some((keyword) => transcript.includes(keyword));
    },
  },
};
