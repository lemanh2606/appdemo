const OLLAMA_URL = "http://localhost:11434/api/chat";

export interface AIResponse {
  content: string;
}

export const askAI = async (prompt: string): Promise<AIResponse> => {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "qwen3:8b",
      messages: [
        {
          role: "system",
          content:
            "Bạn là senior developer, trả lời ngắn gọn, ưu tiên code",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  const data = await res.json();

  return {
    content: data.message?.content || "",
  };
};