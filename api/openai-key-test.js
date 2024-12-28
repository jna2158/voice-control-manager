const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export const testOpenaiKey = async (openaiApiKey) => {
  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello, world!" }],
      }),
    });
    return response.status === 200;
  } catch (error) {
    console.error("API 키 검증 오류", error);
    return false;
  }
};
