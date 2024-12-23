/*
keywords: 명령어를 실행시키는 단어들
blockingKeywords: 명령어 실행을 차단하는 단어들
match: 음성 인식 결과를 처리하는 함수
*/

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
      if (hasBlockingKeyword) return false;

      return keywords.some((keyword) => transcript.includes(keyword));
    },
  },
  SEARCH: {
    keywords: ["검색", "검색하기", "찾아줘"],
    blockingKeywords: ["하지마", "안 해", "취소"],
    match: (transcript) => {
      const { keywords, blockingKeywords } = VOICE_COMMANDS.SEARCH;
      const hasBlockingKeyword = blockingKeywords.some((keyword) =>
        transcript.includes(keyword)
      );
      // 차단 키워드가 있으면 명령어 처리 안함
      if (hasBlockingKeyword) return false;

      // 검색 키워드가 있는지 확인
      const hasSearchKeyword = keywords.some((keyword) =>
        transcript.includes(keyword)
      );
      // 검색 키워드가 없으면 명령어 처리 안함
      if (!hasSearchKeyword) return false;

      // 검색어 추출
      const searchTerm = keywords.reduce((term, keyword) => {
        const parts = transcript.split(keyword);
        return parts[0].trim() || parts[1].trim();
      }, "");
      return searchTerm ? { match: true, searchTerm } : false;
    },
  },
};
