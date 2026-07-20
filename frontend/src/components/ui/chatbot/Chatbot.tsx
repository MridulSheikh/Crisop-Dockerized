"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Send, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { closeChatbot } from "@/redux/features/bot/chatbotSlice";
import {
  useGetAllMessageQuery,
  useSendMessageMutation,
} from "@/redux/features/bot/chatbot.api";
import ChatMessageBubble from "./ChatMessageBubble";
import type { ChatMessage, ChatbotApiMessageLike } from "./types";

const createMessage = (role: ChatMessage["role"], content: string): ChatMessage => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  status: "complete",
  createdAt: new Date().toISOString(),
});

const normalizeMessages = (payload?: ChatbotApiMessageLike[] | null): ChatMessage[] => {
  if (!Array.isArray(payload)) return [];

  return payload.map((message, index) => ({
    id: message.id ?? message._id ?? `${message.role ?? "assistant"}-${index}`,
    role: message.role ?? "assistant",
    content: message.content ?? "",
    status: "complete",
    createdAt: message.createdAt ?? new Date().toISOString(),
  }));
};

export default function Chatbot() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.chatbot.isOpen);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const { data: fetchAllmessage, isLoading, isFetching } = useGetAllMessageQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (fetchAllmessage?.data) {
      setMessages(normalizeMessages(fetchAllmessage.data));
    }
  }, [fetchAllmessage, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (!currentUser) {
      setMessages((prev) => [
        ...prev,
        createMessage("assistant", "Please login to use Crisop AI chat."),
      ]);
      setInputValue("");
      return;
    }

    const userMessage = createMessage("user", trimmed);
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      const res: { data?: string } = await sendMessage({ prompt: trimmed }).unwrap();
      const botResponse = typeof res?.data === "string" && res.data.trim() !== ""
        ? res.data
        : "Thanks! I’m here to help.";

      setMessages((prev) => [
        ...prev,
        createMessage("assistant", botResponse),
      ]);
    } catch (err: unknown) {
      const fallbackMessage =
        err && typeof err === "object" && "data" in err &&
        typeof (err as { data?: { errorMessage?: string } }).data?.errorMessage === "string"
          ? (err as { data?: { errorMessage?: string } }).data?.errorMessage ?? "Sorry, something went wrong. Please try again later."
          : "Sorry, something went wrong. Please try again later.";

      setMessages((prev) => [
        ...prev,
        createMessage("assistant", fallbackMessage),
      ]);
    }
  }, [currentUser, sendMessage]);

  const showGreeting = useMemo(() => messages.length === 0, [messages.length]);

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
            {showGreeting && (
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
                          setInputValue(prompt.substring(3));
                        } else {
                          setMessages((m) => [
                            ...m,
                            createMessage("assistant", "Please login to use Crisop AI chat."),
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
              <ChatMessageBubble key={message.id} message={message} />
            ))}

            {/* Production Grade Typing Loading State */}
            {sending && (
              <div className="flex max-w-[85%] flex-col items-start mr-auto animate-fade-in">
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-none border border-gray-200/50 bg-gray-100 px-4 py-3 shadow-sm">
                  <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
                  <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
                  <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
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
                handleSend(inputValue);
              }}
              className="relative flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 focus-within:bg-white transition-all duration-200"
            >
              {!currentUser ? (
                <div className="flex w-full items-center justify-between gap-3 py-1.5">
                  <p className="text-xs text-gray-500 sm:text-sm">
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
                      isLoading || isFetching
                        ? "Chat loading..."
                        : sending
                          ? "Crisop AI is typing..."
                          : "Ask Crisop AI..."
                    }
                    className="w-full bg-transparent text-sm text-gray-700 outline-none pr-10 py-1.5 disabled:opacity-50"
                    disabled={sending || isLoading || isFetching}
                  />

                  <button
                    type="submit"
                    disabled={!inputValue.trim() || sending || isLoading || isFetching}
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
