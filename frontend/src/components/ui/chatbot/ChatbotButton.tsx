"use client";

import { cn } from "@/lib/utils";
import { toggleChatbot } from "@/redux/features/bot/chatbotSlice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

export default function ChatbotButton() {
  const dispatch = useDispatch();

  const isOpen = useSelector((state: RootState) => state.chatbot.isOpen);

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 30 }}
          whileHover={{
            scale: 1.05,
            y: -2,
          }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 18,
          }}
          onClick={() => dispatch(toggleChatbot())}
          className={cn(
            "fixed right-5 z-50",
            "bottom-[6.5rem]",
            "md:bottom-5",
            "flex items-center gap-2",
            "px-3 md:px-5 py-3 rounded-full",
            "bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500",
            "text-white font-medium",
            "shadow-[0_8px_30px_rgba(16,185,129,0.35)]",
            "border border-white/20 backdrop-blur-xl",
            "overflow-hidden",
          )}
        >
          {/* Glow Effect */}
          <motion.div
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.15, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-white/10 rounded-full"
          />

          {/* Animated Icon */}
          <motion.div
            animate={{
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            <Bot className="w-5 h-5" />
          </motion.div>

          {/* Text */}
          <motion.span
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
            className="relative z-10 text-sm tracking-wide hidden md:block"
          >
            Ask Crisop AI
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}