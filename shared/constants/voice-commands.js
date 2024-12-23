/*
keywords: 명령어를 실행시키는 단어들
blockingKeywords: 명령어 실행을 차단하는 단어들
match: 음성 인식 결과를 처리하는 함수
*/

// 차단 키워드 포함 여부 확인
const hasBlockingKeyword = (transcript, blockingKeywords) => {
  return blockingKeywords.some((keyword) => transcript.includes(keyword));
};

// 키워드 포함 여부 확인
const hasKeyword = (transcript, keywords) => {
  return keywords.some((keyword) => transcript.includes(keyword));
};

export const VOICE_COMMANDS = {
  REFRESH: {
    keywords: ["새로고침", "새로 고침"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.REFRESH;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      return hasKeyword(transcript, keywords);
    },
  },
  SEARCH: {
    keywords: ["검색", "검색하기", "찾아줘"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.SEARCH;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      if (!hasKeyword(transcript, keywords)) return false;

      // 검색어 추출
      let searchTerm = "";
      for (const keyword of keywords) {
        if (transcript.includes(keyword)) {
          const parts = transcript.split(keyword);
          searchTerm = parts[0].trim() || parts[1].trim();
          if (searchTerm) break;
        }
      }
      return searchTerm ? { match: true, searchTerm } : false;
    },
  },
  SCROLL_TOP: {
    keywords: ["맨 위로", "맨위로", "맨 위", "맨 위로 가기"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.SCROLL_TOP;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      return hasKeyword(transcript, keywords);
    },
  },
  SCROLL_BOTTOM: {
    keywords: ["맨 아래로", "맨아래", "맨 아래", "맨 아래로 가기"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.SCROLL_BOTTOM;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      return hasKeyword(transcript, keywords);
    },
  },
  SCROLL_UP: {
    keywords: ["위로", "위", "올라"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.SCROLL_UP;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      return hasKeyword(transcript, keywords);
    },
  },
  SCROLL_DOWN: {
    keywords: ["아래로", "아래", "내려"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.SCROLL_DOWN;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      return hasKeyword(transcript, keywords);
    },
  },
};
