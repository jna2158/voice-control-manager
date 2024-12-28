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
    keywords: ["새로고침", "새로 고침", "다시로드", "다시 로드"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.REFRESH;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      return hasKeyword(transcript, keywords);
    },
  },
  SEARCH: {
    keywords: ["검색", "검색하기", "찾아줘", "알아봐줘", "알아보기"],
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
    keywords: [
      "맨 위로",
      "맨위로",
      "맨 위",
      "맨 위로 가기",
      "가장 위로",
      "가장위로",
    ],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.SCROLL_TOP;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      return hasKeyword(transcript, keywords);
    },
  },
  SCROLL_BOTTOM: {
    keywords: ["맨 아래로", "맨아래", "맨 아래", "가장 아래로", "가장아래로"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.SCROLL_BOTTOM;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      return hasKeyword(transcript, keywords);
    },
  },
  SCROLL_UP: {
    keywords: ["위로", "올라"],
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
  GO_BACK: {
    keywords: ["뒤로", "뒤", "돌아가"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.GO_BACK;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      return hasKeyword(transcript, keywords);
    },
  },
  GO_FORWARD: {
    keywords: ["앞으로 가기", "앞으로"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.GO_FORWARD;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      return hasKeyword(transcript, keywords);
    },
  },
  ZOOM_IN: {
    keywords: ["확대", "크게", "크게 보기", "키우기"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.ZOOM_IN;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      return hasKeyword(transcript, keywords);
    },
  },

  ZOOM_OUT: {
    keywords: ["축소", "작게", "작게 보기", "줄이기"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.ZOOM_OUT;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      return hasKeyword(transcript, keywords);
    },
  },

  CLOSE_TAB: {
    keywords: [
      "탭 닫기",
      "탭닫기",
      "페이지 닫기",
      "페이지닫기",
      "닫아",
      "닫아줘",
    ],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.CLOSE_TAB;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      return hasKeyword(transcript, keywords);
    },
  },
  CLICK_LINK: {
    keywords: ["클릭"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.CLICK_LINK;
      if (hasBlockingKeyword(transcript, blockingKeywords)) return false;
      const clickMatch = transcript.match(/(.+?)\s*클릭/);
      if (clickMatch) {
        return { match: true, linkText: clickMatch[1].trim() };
      }

      return false;
    },
  },
};
