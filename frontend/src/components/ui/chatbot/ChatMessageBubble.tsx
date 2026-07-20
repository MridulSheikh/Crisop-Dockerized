"use client";

import { cn } from "@/lib/utils";
import { Bot, UserRound } from "lucide-react";
import MarkdownMessage from "./MarkdownMessage";
import { ChatMessage } from "./types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

function UserAvatar({ user }: { user: RootState["auth"]["user"] }) {
  const avatar = user?.image;

  if (avatar) {
    return (
      <Image
        src={avatar}
        alt={user?.name || "User"}
        width={36}
        height={36}
        className="h-full w-full rounded-full object-cover"
        unoptimized
      />
    );
  }

  return <UserRound size={15} />;
}

export default function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";
  const currentUser = useSelector((state: RootState) => state.auth.user);

  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "flex max-w-[90%] items-start gap-2 sm:max-w-[82%] lg:max-w-[90%]",
          isUser ? "flex-row-reverse" : "flex-row",
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "mt-1 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border shadow-sm",
            isUser
              ? "border-green-200 bg-green-600 text-white"
              : "border-gray-200 bg-white text-gray-600",
          )}
        >
          {isUser ? <UserAvatar user={currentUser} /> : <Bot size={18} />}
        </div>

        {/* Message */}
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 shadow-sm transition-all",
              isUser
                ? "rounded-br-md bg-green-600 text-white"
                : "rounded-bl-md border border-gray-200 bg-white text-gray-800",
            )}
          >
            <MarkdownMessage content={message.content} role={message.role} />
          </div>
        </div>
      </div>
    </div>
  );
}
