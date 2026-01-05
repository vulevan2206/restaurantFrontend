import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X } from "lucide-react";
import clsx from "clsx";
import { Product } from "@/types/product.type";
import ProductCardMini from "../ProductCardMini";

interface Props {
  primaryColor?: string;
  onSend: (message: string) => Promise<any>;
  allProducts: Product[];
}

interface Message {
  role: "user" | "bot";
  content: any; // Chấp nhận cả string (user) và object (bot)
}

export default function ChatbotWidget({
  primaryColor = "#ff7a00",
  onSend,
  allProducts,
}: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: { reply: "Xin chào 👋 Mình có thể giúp gì cho bạn?" },
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const rawReply = await onSend(userMessage); // Giả sử rawReply là chuỗi JSON có thể bị bọc bởi ```json

      let processedData: any;

      // Kiểm tra xem rawReply là object hay string
      if (typeof rawReply === "object") {
        processedData = rawReply;
      } else {
        try {
          // Xóa bỏ các ký tự Markdown ```json và ``` nếu có
          const cleanJson = rawReply.replace(/```json|```/g, "").trim();
          processedData = JSON.parse(cleanJson);
        } catch (e) {
          // Nếu không parse được thì coi như text bình thường
          processedData = { reply: rawReply };
        }
      }

      setMessages((prev) => [...prev, { role: "bot", content: processedData }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: { reply: "😢 Lỗi rồi, thử lại nhé!" } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm render nội dung tin nhắn bot để tách biệt logic hiển thị Card
  const renderBotMessage = (content: any) => {
    if (typeof content === "string") return content;

    // Lấy danh sách ID từ Bot và đảm bảo nó là mảng chuỗi
    const botProductIds = content.productIds || [];

    // Lọc sản phẩm: ép cả 2 bên về String để so sánh chính xác tuyệt đối
    const suggestedProducts = (allProducts || []).filter((p) =>
      botProductIds.some((botId: any) => String(botId) === String(p._id))
    );

    return (
      <div className="space-y-3">
        {/* Hiển thị câu trả lời của Bot, in đậm tên món nếu AI đã định dạng */}
        <p className="leading-relaxed whitespace-pre-wrap">{content.reply}</p>

        {suggestedProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-3 mt-2">
            {/* Grid-cols-1 giúp Card hiển thị đủ chiều rộng trong khung chat */}
            {suggestedProducts.map((p) => (
              <ProductCardMini key={String(p._id)} product={p} />
            ))}
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="fixed bottom-16 right-4 z-[9999] font-sans">
      {/* Floating Button - GIỮ NGUYÊN STYLE CỦA BẠN */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{ backgroundColor: primaryColor }}
          className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window - GIỮ NGUYÊN STYLE CỦA BẠN */}
      {open && (
        <div
          className={clsx(
            "flex flex-col overflow-hidden bg-white shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-10",
            "fixed bottom-0 right-0 h-[100dvh] w-full rounded-none",
            "sm:absolute sm:bottom-0 sm:right-0 sm:h-[550px] sm:w-[380px] sm:rounded-2xl"
          )}
        >
          {/* Header */}
          <div
            style={{ backgroundColor: primaryColor }}
            className="flex items-center justify-between p-4 text-white"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                🤖
              </div>
              <div>
                <h3 className="text-sm font-bold leading-none">Tư vấn viên</h3>
                <span className="text-[10px] opacity-80">Trực tuyến</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="hover:bg-black/10 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area - GIỮ NGUYÊN STYLE BONG BÓNG CHAT */}
          <div className="flex-1 overflow-y-auto bg-[#f8f9fa] p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={clsx(
                  "flex w-full",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={clsx(
                    "max-w-[85%] px-4 py-2.5 text-sm shadow-sm",
                    msg.role === "user"
                      ? "rounded-[20px] rounded-tr-none text-white"
                      : "rounded-[20px] rounded-tl-none bg-white text-gray-800 border border-gray-100"
                  )}
                  style={
                    msg.role === "user" ? { backgroundColor: primaryColor } : {}
                  }
                >
                  {msg.role === "bot"
                    ? renderBotMessage(msg.content)
                    : msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-[20px] rounded-tl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]"></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area - GIỮ NGUYÊN STYLE INPUT */}
          <div className="border-t bg-white p-4">
            <div className="relative flex items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !e.nativeEvent.isComposing &&
                  handleSend()
                }
                placeholder="Hỏi món ăn, giá, gợi ý..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-4 pr-12 text-sm text-black outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-opacity-50"
                style={{ "--tw-ring-color": primaryColor } as any}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full text-white transition-all disabled:grayscale"
                style={{ backgroundColor: primaryColor }}
              >
                <Send size={16} />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-gray-400">
              Powered by Vu Le
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
