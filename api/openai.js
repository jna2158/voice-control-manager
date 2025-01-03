import { decryptApiKey } from "../popup/utils/decryption-utils.js";

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const COMMAND_MAPPING = {
  새로고침: "REFRESH",
  "가장 위로": "SCROLL_TOP",
  "가장 아래로": "SCROLL_BOTTOM",
  위로: "SCROLL_UP",
  아래로: "SCROLL_DOWN",
  뒤로: "GO_BACK",
  앞으로: "GO_FORWARD",
  확대: "ZOOM_IN",
  축소: "ZOOM_OUT",
  "탭 닫기": "CLOSE_TAB",
  클릭: "CLICK_LINK",
};

// OpenAI API 호출
export const openai = async (transcript) => {
  if (!transcript || transcript.length === 0) return null;

  try {
    const OPENAI_API_KEY = await decryptApiKey();
    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "당신은 사용자의 음성 명령을 분석하는 음성 인식 모델입니다. 사용자의 음성 명령을 분석하여 정해진 카테고리 중 하나로 분류해주세요.",
          },
          {
            role: "user",
            content: `사용자가 ${transcript} 이라고 말했습니다. 이를 분석하여 다음 중 어떤 명령어 해당되는지 반환해주세요.
          명령어: 새로고침, 검색, 가장 위로, 가장 아래로, 위로, 아래로, 뒤로, 앞으로, 확대, 축소, 탭 닫기, 클릭

          1. 응답은 명령어만 단순히 반환해주세요. 예: "새로고침"
          2. 검색 명령어의 경우 무엇을 검색하는지도 같이 반환해주세요. 예: "바나나 검색"
          `,
          },
        ],
        temperature: 0.3,
      }),
    });
    const data = await response.json();
    const command = data.choices[0].message.content.trim();

    // 검색 명령어일 경우
    if (command.includes("검색")) {
      const searchTerm = command
        .replace("검색", "")
        .trim()
        .replace(/['"]/g, "");
      return { commandType: "SEARCH", searchTerm };
    }
    // 검색 명령어가 아닐 경우
    const commandType = COMMAND_MAPPING[command];
    if (commandType) {
      return { commandType };
    }
    // 매칭되는 명령어가 없을 경우
    return null;
  } catch (error) {
    console.error("OpenAI API 호출 오류", error);
    return null;
  }
};
