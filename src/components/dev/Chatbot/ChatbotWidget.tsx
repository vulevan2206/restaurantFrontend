import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X } from "lucide-react";
import clsx from "clsx";

interface Props {
  primaryColor?: string;
  onSend: (message: string) => Promise<string>;
}

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function ChatbotWidget({
  primaryColor = "#ff7a00",
  onSend,
}: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Xin chào 👋 Mình có thể gợi ý món ăn cho bạn nhé!",
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
      const reply = await onSend(userMessage);
      setMessages((prev) => [...prev, { role: "bot", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "😢 Có lỗi xảy ra, bạn thử lại nhé." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-sans">
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{ backgroundColor: primaryColor }}
          className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div
          className={clsx(
            "flex flex-col overflow-hidden bg-white shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-10",
            // Responsive: Mobile chiếm gần hết màn hình, Desktop cố định size
            "fixed bottom-0 right-0 h-[100dvh] w-full rounded-none", // Mobile
            "sm:absolute sm:bottom-0 sm:right-0 sm:h-[550px] sm:w-[380px] sm:rounded-2xl" // Desktop
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

          {/* Messages Area - FIXED HEIGHT scrollable */}
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
                  {msg.content}
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

          {/* Input Area */}
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
