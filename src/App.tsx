import { Toaster } from "@/components/ui/toaster";
import useRouteElement from "@/hooks/useRouteElement";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatbotWidget from "@/components/dev/Chatbot/ChatbotWidget";
import { sendChatbotMessage } from "@/apis/chatbot.api";

function App() {
  const routes = useRouteElement();
  const location = useLocation();

  // Danh sách các tiền tố URL mà bạn KHÔNG muốn hiện chatbot
  const hiddenChatbotPaths = ["/manage", "/login"];

  // Kiểm tra xem URL hiện tại có bắt đầu bằng bất kỳ tiền tố nào trong mảng trên không
  const isChatbotHidden = hiddenChatbotPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  return (
    <div className="relative">
      {routes}
      <ReactQueryDevtools initialIsOpen={false} />

      {/* Chỉ hiển thị khi KHÔNG thuộc các đường dẫn bị ẩn */}
      {!isChatbotHidden && <ChatbotWidget onSend={sendChatbotMessage} />}

      <Toaster />
    </div>
  );
}

export default App;
