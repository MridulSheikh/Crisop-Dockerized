"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  ChevronDown,
  CreditCard,
  Package,
  RotateCcw,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

const faqs = [
  {
    question: "How do I place an order on Crisop?",
    answer:
      "Browse your favorite grocery products, add them to your cart, review your order, provide your delivery information, and complete checkout using your preferred payment method.",
    icon: ShoppingCart,
  },
  {
    question: "What payment methods does Crisop support?",
    answer:
      "Crisop supports secure online payments through Stripe, allowing customers to complete purchases using supported debit and credit cards.",
    icon: CreditCard,
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes. After placing an order, you can view its current status from your account and follow its progress until it is delivered.",
    icon: Package,
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Order cancellation depends on the current status of the order. If the order has not entered the fulfillment process, cancellation may be possible.",
    icon: RotateCcw,
  },
  {
    question: "Can I request a return or refund?",
    answer:
      "If an eligible product has an issue, you can contact support regarding a return or refund. Requests are reviewed according to the applicable order and product conditions.",
    icon: RotateCcw,
  },
  {
    question: "How can I contact Crisop support?",
    answer:
      "You can contact the Crisop support team through the available support channels for questions related to orders, products, payments, or your account.",
    icon: Sparkles,
  },
];

const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative mt-10 overflow-hidden bg-[#f6f7f6] py-16 md:mt-24 md:px-5 lg:py-28">
    
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-green-400/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-screen-2xl px-6">
        {/* header */}
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mb-16 max-w-4xl text-center"
        >
          <motion.div
            variants={fadeUp}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-emerald-700"
          >
            <Sparkles size={14} />
            Frequently Asked Questions
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-6xl font-semibold leading-tight tracking-tight text-gray-900"
          >
            Everything you need to know
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-500 md:text-lg"
          >
            Find answers about shopping, orders, payments, delivery, and your
            overall Crisop experience.
          </motion.p>
        </motion.div>

        {/* main content  */}
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] xl:gap-16">
          {/* left side  */}
          <motion.div
            initial={{
              opacity: 0,
              x: -50,
              scale: 0.96,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative"
          >
            {/* gradient  */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-emerald-400/10 opacity-70 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            {/* image card  */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem]">
              <Image
                src="/img/crisop-faq.png"
                alt="Crisop grocery shopping experience"
                fill
                priority={false}
                className="object-contain transition-transform duration-700"
              />
            </div>
          </motion.div>

          {/* right faq  */}
          <motion.div
            variants={containerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className="w-full"
          >
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const Icon = faq.icon;

              return (
                <motion.div
                  key={faq.question}
                  variants={fadeUp}
                  className="group mb-3"
                >
                  <div
                    className={`overflow-hidden rounded-2xl border transition-all duration-500 ${
                      isOpen
                        ? "border-emerald-200 bg-white shadow-lg shadow-emerald-900/5"
                        : "border-gray-200/70 bg-white/70 hover:border-emerald-100 hover:bg-white"
                    }`}
                  >
                    {/* Question */}
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        {/* Icon */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                            isOpen
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                              : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100"
                          }`}
                        >
                          <Icon size={17} />
                        </div>

                        <span className="text-sm font-semibold tracking-tight text-gray-800 md:text-base">
                          {faq.question}
                        </span>
                      </div>

                      {/* Arrow */}
                      <motion.div
                        animate={{
                          rotate: isOpen ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                          isOpen
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 text-gray-400"
                        }`}
                      >
                        <ChevronDown size={17} />
                      </motion.div>
                    </button>

                    {/* Answer */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <div className="border-t border-emerald-50 px-5 pb-6 pt-4 pl-[76px]">
                            <p className="text-sm leading-6 text-gray-500">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
