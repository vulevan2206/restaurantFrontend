import { Toaster } from "@/components/ui/toaster";
import useRouteElement from "@/hooks/useRouteElement";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatbotWidget from "@/components/dev/Chatbot/ChatbotWidget";
import { sendChatbotMessage } from "@/apis/chatbot.api";
import { useQuery } from "@tanstack/react-query";
import * as productApi from "@/apis/product.api";

function App() {
  const routes = useRouteElement();
  const location = useLocation();

  // 1. Lấy danh sách sản phẩm để truyền vào Chatbot

  const { data: productsResponse } = useQuery({
    queryKey: ["products", { limit: "100", status: "AVAILABLE" }],
    queryFn: () =>
      productApi.getProducts({ limit: "100", status: "AVAILABLE" }),
    staleTime: 1000 * 60 * 10,
  });

  // 2. Truy xuất đúng vào mảng Product[] từ SuccessResponse -> PaginationResponse
  const allProducts = productsResponse?.data?.data?.content || [];

  const hiddenChatbotPaths = ["/manage", "/login"];
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

      {!isChatbotHidden && (
        <ChatbotWidget onSend={sendChatbotMessage} allProducts={allProducts} />
      )}

      <Toaster />
    </div>
  );
}

export default App;
