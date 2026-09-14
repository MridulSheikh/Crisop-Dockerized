"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowUpRight,
  Bot,
  Check,
  MessageCircle,
  Sparkles,
  User,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { toggleChatbot } from "@/redux/features/bot/chatbotSlice";

const suggestions = [
  "What can I cook with chicken?",
  "Show me healthy snacks",
  "Find products under $20",
];

const messages = [
  {
    type: "user",
    text: "What can I make with chicken?",
  },
  {
    type: "ai",
    text: "Here are some great options based on your ingredients:",
  },
];

const products = [
  {
    name: "Chicken Breast",
    price: "$8.49",
    image: "/img/products/chicken.png",
  },
  {
    name: "Extra Virgin Olive Oil",
    price: "$12.99",
    image: "/img/products/olive-oil.png",
  },
  {
    name: "Fresh Garlic",
    price: "$3.49",
    image: "/img/products/garlic.png",
  },
];

const CrisopAISection = () => {
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [showAIMessage, setShowAIMessage] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showProducts, setShowProducts] = useState(false);
  const dispatch = useDispatch();

  const animationStarted = useRef(false);

  const responseText = messages[1].text;

  useEffect(() => {
    if (animationStarted.current) return;

    animationStarted.current = true;

    const startAnimation = async () => {
      // User message appears
      await new Promise((resolve) => setTimeout(resolve, 700));
      setShowUserMessage(true);

      // AI thinking starts
      await new Promise((resolve) => setTimeout(resolve, 900));
      setIsThinking(true);

      // AI finishes thinking
      await new Promise((resolve) => setTimeout(resolve, 1800));
      setIsThinking(false);
      setShowAIMessage(true);

      // AI typing animation
      for (let i = 0; i <= responseText.length; i++) {
        setTypedText(responseText.slice(0, i));

        await new Promise((resolve) =>
          setTimeout(resolve, 25)
        );
      }

      // Products appear
      await new Promise((resolve) => setTimeout(resolve, 500));
      setShowProducts(true);
    };

    startAnimation();
  }, [responseText]);

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="relative mx-auto container px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <Sparkles size={15} />
            Powered by AI
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-950 md:text-5xl">
            Meet Crisop AI
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-500 md:text-lg">
            Your intelligent shopping assistant that helps you discover
            products, find ingredients, and make better shopping decisions.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="mt-16 grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-7xl">
              Shopping that
              <br />
              <span className="text-emerald-600">
                understands you.
              </span>
            </h3>

            <p className="mt-5 max-w-md text-[15px] leading-7 text-gray-500">
              Crisop AI understands natural language and helps customers
              discover relevant groceries without having to search through
              hundreds of products manually.
            </p>

            {/* Features */}
            <div className="mt-8 space-y-4">
              {[
                "Natural language product search",
                "Personalized product recommendations",
                "AI-powered grocery discovery",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.15 * index,
                  }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check size={14} strokeWidth={2.5} />
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
                onClick={() => dispatch(toggleChatbot())}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="
                group mt-9 inline-flex items-center gap-2
                rounded-full bg-gray-950 px-5 py-3
                text-sm font-medium text-white
                transition-all duration-300
                hover:bg-emerald-600
              "
            >
              Explore Crisop AI

              <ArrowUpRight
                size={16}
                className="
                  transition-transform duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </motion.button>
          </motion.div>

          {/* AI Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            {/* Glow */}
            <div className="absolute -inset-6 rounded-[2.5rem] bg-emerald-100/50 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.10)]">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  {/* AI Avatar */}
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <Bot size={20} />

                    <motion.span
                      animate={{
                        scale: [1, 1.25, 1],
                        opacity: [1, 0.6, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Crisop AI
                    </p>

                    <p className="text-xs text-emerald-600">
                      Online · Ready to help
                    </p>
                  </div>
                </div>

                <MessageCircle
                  size={19}
                  className="text-gray-400"
                />
              </div>

              {/* Chat Body */}
              <div className="min-h-[420px] space-y-5 bg-[#fafafa] p-5">
                {/* User Message */}
                <AnimatePresence>
                  {showUserMessage && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 15,
                        x: 20,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        x: 0,
                        scale: 1,
                      }}
                      transition={{
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex justify-end"
                    >
                      <div className="flex max-w-[80%] items-end gap-2">
                        <div className="rounded-2xl rounded-br-md bg-gray-950 px-4 py-3 text-sm leading-6 text-white">
                          {messages[0].text}
                        </div>

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white">
                          <User
                            size={15}
                            className="text-gray-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Thinking Indicator */}
                <AnimatePresence>
                  {isThinking && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-2"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <Bot size={15} />
                      </div>

                      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-gray-100 bg-white px-4 py-3 shadow-sm">
                        <span className="text-xs font-medium text-gray-400">
                          Crisop AI
                        </span>

                        <div className="ml-1 flex items-center gap-1">
                          {[0, 1, 2].map((item) => (
                            <motion.span
                              key={item}
                              animate={{
                                y: [0, -4, 0],
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: item * 0.15,
                              }}
                              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Response */}
                <AnimatePresence>
                  {showAIMessage && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex gap-2"
                    >
                      {/* AI Avatar */}
                      <motion.div
                        initial={{ scale: 0.7 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: 0.4,
                          type: "spring",
                          stiffness: 300,
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white"
                      >
                        <Bot size={15} />
                      </motion.div>

                      {/* AI Bubble */}
                      <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-gray-100 bg-white px-4 py-3 shadow-sm">
                        {/* Typing Text */}
                        <div className="flex items-start gap-1">
                          <p className="text-sm leading-6 text-gray-600">
                            {typedText}
                          </p>

                          {/* Typing Cursor */}
                          {typedText.length < responseText.length && (
                            <motion.span
                              animate={{
                                opacity: [1, 0, 1],
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                              }}
                              className="mt-1 h-4 w-[2px] shrink-0 rounded-full bg-emerald-500"
                            />
                          )}
                        </div>

                        {/* Product Recommendations */}
                        <AnimatePresence>
                          {showProducts && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                height: 0,
                              }}
                              animate={{
                                opacity: 1,
                                height: "auto",
                              }}
                              transition={{
                                duration: 0.5,
                              }}
                              className="mt-4 space-y-2.5"
                            >
                              {products.map((product, index) => (
                                <motion.div
                                  key={product.name}
                                  initial={{
                                    opacity: 0,
                                    y: 12,
                                    scale: 0.97,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                  }}
                                  transition={{
                                    delay: index * 0.18,
                                    duration: 0.45,
                                    ease: [0.22, 1, 0.36, 1],
                                  }}
                                  className="
                                    flex items-center gap-3
                                    rounded-xl border border-gray-100
                                    bg-gray-50 p-2.5
                                    transition-colors
                                    hover:border-emerald-200
                                    hover:bg-emerald-50/50
                                  "
                                >
                                  {/* Product Image */}
                                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-white">
                                    <div className="h-7 w-7 rounded-full bg-emerald-100" />
                                  </div>

                                  {/* Product Info */}
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-gray-800">
                                      {product.name}
                                    </p>

                                    <p className="mt-0.5 text-xs text-emerald-600">
                                      {product.price}
                                    </p>
                                  </div>

                                  {/* Arrow */}
                                  <motion.div
                                    initial={{
                                      opacity: 0,
                                      x: -5,
                                    }}
                                    animate={{
                                      opacity: 1,
                                      x: 0,
                                    }}
                                    transition={{
                                      delay: index * 0.18 + 0.25,
                                    }}
                                  >
                                    <ArrowUpRight
                                      size={15}
                                      className="text-gray-400"
                                    />
                                  </motion.div>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Suggestions */}
              <div className="border-t border-gray-100 bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles
                    size={14}
                    className="text-emerald-600"
                  />

                  <span className="text-xs font-medium text-gray-400">
                    Try asking
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <motion.button
                      key={suggestion}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      className="
                        rounded-full border border-gray-200
                        bg-white px-3 py-2
                        text-xs font-medium text-gray-600
                        transition-all duration-200
                        hover:border-emerald-300
                        hover:bg-emerald-50
                        hover:text-emerald-700
                      "
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CrisopAISection;