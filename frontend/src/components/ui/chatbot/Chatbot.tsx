"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Send, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { closeChatbot } from "@/redux/features/bot/chatbotSlice";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useGetAllMessageQuery,
  useSendMessageMutation,
} from "@/redux/features/bot/chatbot.api";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
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
  const {
    data: fetchAllmessage,
    isLoading,
    isFetching,
    error,
  } = useGetAllMessageQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (fetchAllmessage?.data) {
      setMessages(fetchAllmessage.data);
    }
  }, [fetchAllmessage]);

  // Scroll to bottom when messages change or when the bot is typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      role: "user",
      content: text,
    };
    setMessages((m) => [...m, userMsg]);
    setInputValue("");

    try {
      const res: any = await sendMessage({ prompt: text }).unwrap();
      const botResponses = res?.data;

      const botMsg: Message = {
        role: "assistant",
        content: botResponses,
      };
      setMessages((m) => [...m, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        role: "assistant",
        content:
          err.data.errorMessage ||
          "Sorry, something went wrong. Please try again later.",
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
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-full animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                  message.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div className="max-w-[90%] sm:max-w-[82%] lg:max-w-[90%]">
                  {message.content && (
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 shadow-sm transition-all",
                        message.role === "user"
                          ? "rounded-br-md bg-green-600 text-white"
                          : "rounded-bl-md border border-gray-200 bg-white text-gray-800",
                      )}
                    >
                      <Markdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="mb-2 text-base font-bold">
                              {children}
                            </h1>
                          ),

                          h2: ({ children }) => (
                            <h2 className="mb-2 mt-3 text-[15px] font-semibold">
                              {children}
                            </h2>
                          ),

                          h3: ({ children }) => (
                            <h3 className="mb-1 mt-2 text-sm font-semibold">
                              {children}
                            </h3>
                          ),

                          p: ({ children }) => (
                            <p
                              className={cn(
                                "text-sm leading-6 break-words [&:not(:last-child)]:mb-2",
                                message.role === "user"
                                  ? "text-white"
                                  : "text-gray-700",
                              )}
                            >
                              {children}
                            </p>
                          ),

                          ul: ({ children }) => (
                            <ul className="my-2 list-disc space-y-1 pl-5 text-sm">
                              {children}
                            </ul>
                          ),

                          ol: ({ children }) => (
                            <ol className="my-2 list-decimal space-y-1 pl-5 text-sm">
                              {children}
                            </ol>
                          ),

                          li: ({ children }) => (
                            <li
                              className={cn(
                                "leading-6",
                                message.role === "user"
                                  ? "text-white"
                                  : "text-gray-700",
                              )}
                            >
                              {children}
                            </li>
                          ),

                          strong: ({ children }) => (
                            <strong className="font-semibold">
                              {children}
                            </strong>
                          ),

                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),

                          blockquote: ({ children }) => (
                            <blockquote
                              className={cn(
                                "my-2 border-l-4 pl-3 italic text-sm",
                                message.role === "user"
                                  ? "border-green-300 text-green-100"
                                  : "border-green-500 text-gray-600",
                              )}
                            >
                              {children}
                            </blockquote>
                          ),

                          code: ({ children }) => (
                            <code
                              className={cn(
                                "rounded px-1.5 py-0.5 font-mono text-[13px]",
                                message.role === "user"
                                  ? "bg-green-700 text-white"
                                  : "bg-gray-100 text-red-600",
                              )}
                            >
                              {children}
                            </code>
                          ),

                          pre: ({ children }) => (
                            <pre className="my-3 overflow-x-auto rounded-xl bg-gray-900 p-3 text-[13px] text-gray-100">
                              {children}
                            </pre>
                          ),

                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                "underline underline-offset-2",
                                message.role === "user"
                                  ? "text-green-100"
                                  : "text-green-600 hover:text-green-700",
                              )}
                            >
                              {children}
                            </a>
                          ),

                          hr: () => <hr className="my-3 border-gray-300" />,

                          table: ({ children }) => (
                            <div className="my-3 overflow-x-auto">
                              <table className="min-w-full border-collapse text-sm">
                                {children}
                              </table>
                            </div>
                          ),

                          thead: ({ children }) => (
                            <thead className="bg-gray-100">{children}</thead>
                          ),

                          th: ({ children }) => (
                            <th className="border border-gray-300 px-3 py-2 text-left font-medium">
                              {children}
                            </th>
                          ),

                          td: ({ children }) => (
                            <td className="border border-gray-300 px-3 py-2">
                              {children}
                            </td>
                          ),
                        }}
                      >
                        {message.content}
                      </Markdown>
                    </div>
                  )}
                </div>
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
                     isLoading? "Chat loading..." :  sending ? "Crisop AI is typing..." : "Ask Crisop AI..."
                    }
                    className="w-full bg-transparent text-sm text-gray-700 outline-none pr-10 py-1.5 disabled:opacity-50"
                    disabled={sending ||  isLoading}
                  />

                  <button
                    type="submit"
                    disabled={!inputValue.trim() || sending || isLoading}
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
