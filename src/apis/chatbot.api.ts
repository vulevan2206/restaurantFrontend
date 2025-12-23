export interface ChatbotResponse {
  reply: string;
}

export const sendChatbotMessage = async (
  message: string
): Promise<string> => {
  const res = await fetch("http://localhost:8080/api/chatbot/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  if (!res.ok) {
    throw new Error("Chatbot API error");
  }

  const data: ChatbotResponse = await res.json();
  return data.reply;
};
