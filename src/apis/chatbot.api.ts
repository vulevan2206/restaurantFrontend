import { SuccessResponse } from "@/types/utils.type";
import http from "@/utils/http";

export interface ChatbotResponse {
  reply: string;
}

export const sendChatbotMessage = async (message: string): Promise<string> => {
  const res = await http.post<SuccessResponse<ChatbotResponse>>(
    "/chatbot/chat",
    {
      message,
    }
  );

  return (res.data as any).reply;
};
