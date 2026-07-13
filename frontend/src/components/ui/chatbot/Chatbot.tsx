"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Leaf, Send, X, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { closeChatbot } from "@/redux/features/bot/chatbotSlice";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import { useSendMessageMutation } from "@/redux/features/bot/chatbot.api";
import Markdown from "react-markdown";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductItem = {
  _id: string;
  name: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
};

type Message = {
  intent?: string;
  id: string;
  role: "user" | "assistant";
  content?: string;
  products?: ProductItem[];
};

export default function Chatbot() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.chatbot.isOpen);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Safely resolve user state (assuming useCurrentUser is a selector function)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const currentUser = useSelector((state: RootState) => useCurrentUser(state));

  const [messages, setMessages] = useState<Message[]>([]);

  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();

  // Scroll to bottom when messages change or when the bot is typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: String(Date.now()),
      role: "user",
      content: text,
    };
    setMessages((m) => [...m, userMsg]);
    setInputValue("");

    try {
      const res: any = await sendMessage({ message: text }).unwrap();
      const payload = res?.data ?? res;

      const botResponses =
        payload?.botResponse ??
        payload?.bot_response ??
        payload?.responses ??
        [];

      if (!Array.isArray(botResponses)) {
        const fallback: Message = {
          intent: payload.intentType,
          id: String(Date.now() + 1),
          role: "assistant",
          content: String(
            payload?.message ?? payload?.botMessage ?? JSON.stringify(payload),
          ),
        };
        setMessages((m) => [...m, fallback]);
        return;
      }

      const assistantMessages: Message[] = [];
      botResponses.forEach((item: any) => {
        const intent = item.intentType;
        if (intent === "PRODUCT_DETAILS") {
          const products = (item.data ?? []).map((p: any) => ({
            _id: p._id,
            name: p.name,
            price: p.price,
            discountPrice: p.discountPrice ?? p.price,
            imageUrl: p.images && p.images[0]?.url,
          }));

          assistantMessages.push({
            intent: item.intentType,
            id: String(Date.now() + Math.random()),
            role: "assistant",
            content: item.message ?? item.msg ?? "Here are some products:",
            products,
          });
        } else if (intent === "ORDER_DETAILS") {
          const textMsg =
            item.message ??
            item.messsge ??
            item.msg ??
            "I couldn't find your order. Please try again with Order ID";
          assistantMessages.push({
            intent: item.intentType,
            id: String(Date.now() + Math.random()),
            role: "assistant",
            content: textMsg,
          });
        } else {
          const textMsg =
            item.message ?? item.msg ?? item.text ?? JSON.stringify(item);
          assistantMessages.push({
            intent: item.intentType,
            id: String(Date.now() + Math.random()),
            role: "assistant",
            content: textMsg,
          });
        }
      });

      setMessages((m) => [...m, ...assistantMessages]);
    } catch (err) {
      const errorMsg: Message = {
        id: String(Date.now() + 2),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again later.",
      };
      setMessages((m) => [...m, errorMsg]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-5 right-5 z-50 flex h-[80vh] max-h-[700px] w-[95vw] flex-col overflow-hidden rounded-3xl border border-green-100 bg-white/95 backdrop-blur-md shadow-2xl sm:w-[420px]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner">
                  <Leaf size={22} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="font-semibold tracking-wide text-sm sm:text-base">
                    Crisop AI
                  </h2>
                  <p className="text-xs text-green-100/90">
                    Your Smart Grocery Assistant
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => dispatch(closeChatbot())}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20 active:scale-95"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Timeline Body */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-green-50/30 to-white p-4 space-y-4 scrollbar-thin scrollbar-thumb-green-100">

            {/* greeting ui */}
            {messages.length <= 1 && (
              <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in">
                {/* Animated Decorative Icon */}
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 text-green-600 shadow-sm border border-green-100/50">
                  <Leaf size={32} className="animate-pulse" />
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-ping" />
                </div>

                {/* Typography */}
                <h3 className="text-base font-semibold text-gray-800 tracking-wide">
                  What are you looking for today?
                </h3>
                <p className="mt-1 max-w-[240px] text-xs text-gray-500 leading-normal">
                  Ask me about fresh organic groceries, existing orders, or
                  daily discounts!
                </p>

                {/* Dynamic Quick-Action Prompts */}
                <div className="mt-6 w-full space-y-2 px-2">
                  {[
                    "🥦 Find fresh organic vegetables",
                    "📦 Track my recent order status",
                    "⚡ What are the best offers today?",
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (currentUser) {
                          setInputValue(prompt.substring(3)); // Strips emoji for cleaner input
                        } else {
                          setMessages((m) => [
                            ...m,
                            {
                              id: String(Date.now() + index),
                              role: "assistant",
                              content: "Please login to use Crisop AI chat.",
                            },
                          ]);
                        }
                      }}
                      className="w-full text-left rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-xs font-medium text-gray-600 transition-all hover:border-green-200 hover:bg-green-50/30 hover:text-green-700 shadow-2xs active:scale-[0.99]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col max-w-[85%]",
                  message.role === "user"
                    ? "ml-auto items-end"
                    : "mr-auto items-start",
                )}
              >
                {/* Text Bubble */}
                {message.content && (
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-all",
                      message.role === "user"
                        ? "rounded-tr-none bg-green-600 text-white shadow-green-100"
                        : "rounded-tl-none bg-gray-100 text-gray-800 border border-gray-200/50",
                    )}
                  >
                    <Markdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-lg font-bold mb-1.5">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-base font-semibold mb-1">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-semibold mb-1">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p
                            className={cn(
                              "text-xs sm:text-sm whitespace-pre-line break-words",
                              message.role === "user"
                                ? "text-white"
                                : "text-gray-700",
                            )}
                          >
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-4 space-y-0.5 my-1 text-xs sm:text-sm">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-4 space-y-0.5 my-1 text-xs sm:text-sm">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li
                            className={cn(
                              message.role === "user"
                                ? "text-white"
                                : "text-gray-700",
                            )}
                          >
                            {children}
                          </li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold">{children}</strong>
                        ),
                      }}
                    >
                      {message.content}
                    </Markdown>
                  </div>
                )}

                {/* Horizontal Product Grid Slider */}
                {message.products && message.products.length > 0 && (
                  <div className="flex w-[90vw] sm:w-[380px] gap-3 overflow-x-auto pb-2 pt-2 scrollbar-none snap-x -ml-2">
                    {message.products.map((product) => (
                      <div
                        key={product._id}
                        className="w-[160px] flex-shrink-0 snap-start rounded-2xl border border-gray-100 bg-white p-2.5 shadow-sm transition hover:shadow-md hover:border-green-100"
                      >
                        {/* Product Image */}
                        <div className="relative h-24 w-full overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              sizes="160px"
                              className="object-cover object-center"
                            />
                          ) : (
                            <Bot className="text-gray-300" size={24} />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="mt-2 flex flex-col justify-between">
                          <h4 className="truncate text-xs font-semibold text-gray-800">
                            {product.name}
                          </h4>

                          <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-xs font-bold text-green-600">
                              ৳{product.discountPrice}
                            </span>
                            {product.price > product.discountPrice && (
                              <span className="text-[10px] text-gray-400 line-through">
                                ৳{product.price}
                              </span>
                            )}
                          </div>

                          <Link
                            href={`/shop/${product._id}`}
                            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-green-500 py-2 text-[11px] font-medium text-white shadow-sm transition hover:bg-green-600 active:scale-[0.98]"
                          >
                            <ShoppingCart size={12} />
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Production Grade Typing Loading State */}
            {sending && (
              <div className="flex flex-col items-start mr-auto max-w-[85%] animate-fade-in">
                <div className="rounded-2xl rounded-tl-none bg-gray-100 border border-gray-200/50 px-4 py-3 shadow-sm flex items-center gap-1">
                  <motion.span
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="h-1.5 w-1.5 rounded-full bg-gray-400 inline-block"
                  />
                  <motion.span
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      delay: 0.15,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-gray-400 inline-block"
                  />
                  <motion.span
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                    className="h-1.5 w-1.5 rounded-full bg-gray-400 inline-block"
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form / Chat Input Area */}
          <div className="border-t border-gray-100 bg-white p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!currentUser) {
                  setMessages((m) => [
                    ...m,
                    {
                      id: String(Date.now() + 5),
                      role: "assistant",
                      content: "Please login to use Crisop AI chat.",
                    },
                  ]);
                  return;
                }
                handleSend(inputValue);
              }}
              className="relative flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 focus-within:bg-white transition-all duration-200"
            >
              {!currentUser ? (
                <div className="flex w-full items-center justify-between gap-3 py-1.5">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Login to start chatting with Crisop AI.
                  </p>
                  <Link
                    href="/login"
                    className="ml-auto rounded-xl bg-green-500 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-green-600 active:scale-95"
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      sending ? "Crisop AI is typing..." : "Ask Crisop AI..."
                    }
                    className="w-full bg-transparent text-sm text-gray-700 outline-none pr-10 py-1.5 disabled:opacity-50"
                    disabled={sending}
                  />

                  <button
                    type="submit"
                    disabled={!inputValue.trim() || sending}
                    className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-green-500 text-white transition hover:bg-green-600 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-sm"
                  >
                    <Send size={14} />
                  </button>
                </>
              )}
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
