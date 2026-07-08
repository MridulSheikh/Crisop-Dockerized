"use client";

import { closeChatbot } from "@/redux/features/bot/chatbotSlice";
import { useSendMessageMutation } from "@/redux/features/bot/chatbot.api";
import { RootState } from "@/redux/store";
import Link from "next/link";
import {
  FormEvent,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Send, Sparkles, Bot } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatResponse = {
  data?: {
    intentType?: "PRODUCT_DETAILS" | "ORDER_DETAILS" | "GENERAL_QA";
    botResponse?: string;
    action?: string;
    data?: {
      message?: string;
      response?: string;
      reply?: string;
      answer?: string;
      botResponse?: string;
    };
    meta?: {
      inboxId?: string;
      analysis?: {
        suggestions?: string[];
      };
    };
    message?: string;
    response?: string;
    reply?: string;
    answer?: string;
    inboxId?: string;
  };
  message?: string;
  response?: string;
  reply?: string;
  answer?: string;
  inboxId?: string;
};

const loginRequiredMessage =
  "Please login first to chat with Crisop AI. I can help you after you are signed in.";

const getBotReply = (response: ChatResponse) => {
  return (
    response?.data?.botResponse ||
    response?.data?.data?.botResponse ||
    response?.data?.data?.response ||
    response?.data?.data?.reply ||
    response?.data?.data?.answer ||
    response?.data?.data?.message ||
    response?.data?.response ||
    response?.data?.reply ||
    response?.data?.answer ||
    response?.data?.message ||
    response?.response ||
    response?.reply ||
    response?.answer ||
    response?.message ||
    "I received your message, but could not read the response."
  );
};

const getInboxId = (response: ChatResponse) => {
  return (
    response?.data?.meta?.inboxId || response?.data?.inboxId || response?.inboxId
  );
};

const getSuggestions = (response: ChatResponse) => {
  return response?.data?.meta?.analysis?.suggestions;
};

const renderInlineMarkdown = (text: string) => {
  const nodes: ReactNode[] = [];
  const inlinePattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;

  text.replace(inlinePattern, (match, _value, offset) => {
    if (offset > lastIndex) {
      nodes.push(text.slice(lastIndex, offset));
    }

    if (match.startsWith("**")) {
      nodes.push(
        <strong key={`${match}-${offset}`} className="font-semibold">
          {match.slice(2, -2)}
        </strong>,
      );
    } else {
      const linkMatch = match.match(/\[([^\]]+)\]\(([^)]+)\)/);

      if (linkMatch) {
        nodes.push(
          <a
            key={`${match}-${offset}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-green-700 underline underline-offset-2"
          >
            {linkMatch[1]}
          </a>,
        );
      }
    }

    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length ? nodes : text;
};

function MarkdownMessage({ content }: { content: string }) {
  const elements: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (!listItems.length) {
      return;
    }

    elements.push(
      <ul
        key={`list-${elements.length}`}
        className="my-2 list-disc space-y-1 pl-5"
      >
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`}>{renderInlineMarkdown(item)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  content.split("\n").forEach((line, index) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      flushList();
      elements.push(<div key={`space-${index}`} className="h-2" />);
      return;
    }

    if (trimmedLine === "---") {
      flushList();
      elements.push(
        <hr key={`divider-${index}`} className="my-3 border-green-100" />,
      );
      return;
    }

    if (trimmedLine.startsWith("- ")) {
      listItems.push(trimmedLine.slice(2));
      return;
    }

    flushList();

    if (trimmedLine.startsWith("### ")) {
      elements.push(
        <h3
          key={`heading-3-${index}`}
          className="mb-2 mt-3 text-base font-semibold text-gray-900 first:mt-0"
        >
          {renderInlineMarkdown(trimmedLine.slice(4))}
        </h3>,
      );
      return;
    }

    if (trimmedLine.startsWith("## ")) {
      elements.push(
        <h3
          key={`heading-2-${index}`}
          className="mb-2 mt-3 text-base font-semibold text-gray-900 first:mt-0"
        >
          {renderInlineMarkdown(trimmedLine.slice(3))}
        </h3>,
      );
      return;
    }

    elements.push(
      <p key={`paragraph-${index}`} className="leading-relaxed">
        {renderInlineMarkdown(trimmedLine)}
      </p>,
    );
  });

  flushList();

  return <div className="space-y-1 break-words">{elements}</div>;
}

export default function Chatbot() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.chatbot.isOpen);
  const authToken = useSelector((state: RootState) => state.auth.token);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [inputValue, setInputValue] = useState("");
  const [inboxId, setInboxId] = useState<string>();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content:
        "Welcome to Crisop AI. Ask me about fresh groceries, healthy foods, or product recommendations.",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isLoggedIn = Boolean(authToken);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (
    event?: FormEvent<HTMLFormElement>,
    messageText?: string,
  ) => {
    event?.preventDefault();

    const text = (messageText || inputValue).trim();

    if (!text || isLoading) {
      return;
    }

    if (!isLoggedIn) {
      setInputValue("");
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: loginRequiredMessage,
        },
      ]);
      return;
    }

    setInputValue("");
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      },
    ]);

    try {
      const response = await sendMessage({ message: text, inboxId }).unwrap();
      const nextInboxId = getInboxId(response as ChatResponse);

      if (nextInboxId) {
        setInboxId(nextInboxId);
      }
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: getBotReply(response as ChatResponse),
        },
      ]);
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, I could not connect to Crisop AI right now. Please try again.",
        },
      ]);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 40,
          }}
          className="
          fixed bottom-5 right-5 z-50
          w-[95vw] sm:w-[420px]
          h-[80vh] max-h-[700px]

          bg-white
          rounded-3xl

          shadow-2xl
          border border-green-100

          overflow-hidden
          flex flex-col
          "
        >
          {/* HEADER */}

          <div
            className="
          p-4
          bg-gradient-to-r
          from-green-600
          to-emerald-400
          text-white
          "
          >
            <div
              className="
            flex
            items-center
            justify-between
            "
            >
              <div
                className="
              flex items-center gap-3
              "
              >
                <div
                  className="
                w-11 h-11
                rounded-2xl

                bg-white/20

                flex items-center
                justify-center
                "
                >
                  <Leaf size={22} />
                </div>

                <div>
                  <h2 className="font-semibold">Crisop AI</h2>

                  <p
                    className="
                  text-xs
                  text-white/80
                  "
                  >
                    Grocery Assistant
                  </p>
                </div>
              </div>

              <button
                onClick={() => dispatch(closeChatbot())}
                className="
              w-9 h-9
              rounded-xl

              bg-white/20

              flex
              items-center
              justify-center
              "
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* BODY */}

          <div
            className="
          flex-1

          overflow-y-auto

          bg-gradient-to-b
          from-green-50
          to-white

          p-4

          "
          >
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      message.role === "user"
                        ? "bg-green-500 text-white rounded-br-md"
                        : "bg-white text-gray-700 border border-green-100 rounded-bl-md"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-green-700">
                        <Bot size={15} />
                        Crisop AI
                      </div>
                    )}

                    {message.role === "assistant" ? (
                      <MarkdownMessage content={message.content} />
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-green-100 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-green-700">
                      <Bot size={15} />
                      Crisop AI
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-green-400" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-green-400 [animation-delay:120ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-green-400 [animation-delay:240ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {!isLoggedIn && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <p>Please login to start chatting with Crisop AI.</p>

                <Link
                  href="/login"
                  className="mt-3 inline-flex h-9 items-center justify-center rounded-xl bg-green-500 px-4 text-sm font-medium text-white transition hover:bg-green-600"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* INPUT */}

          <div
            className="
          p-4

          border-t

          bg-white
          "
          >
            <form className="relative" onSubmit={handleSubmit}>
              <textarea
                rows={2}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={!isLoggedIn}
                placeholder={
                  isLoggedIn ? "Ask Crisop AI..." : "Please login to chat..."
                }
                className="
              w-full

              resize-none

              rounded-2xl

              border
              border-green-100

              bg-green-50

              px-4
              py-3

              pr-14

              text-sm

              outline-none

              focus:ring-2
              focus:ring-green-400
              disabled:cursor-not-allowed
              disabled:opacity-70
              "
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading || !isLoggedIn}
                className="
              absolute

              right-2

              bottom-2

              w-10

              h-10

              rounded-xl

              bg-green-500

              text-white

              flex

              items-center

              justify-center
              disabled:cursor-not-allowed
              disabled:opacity-60
              "
              >
                <Send size={17} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
