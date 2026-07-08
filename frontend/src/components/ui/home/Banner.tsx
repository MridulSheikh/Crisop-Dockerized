"use client";

import Image from "next/image";
import React from "react";
import { Truck, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";
import HeroButtons from "./HeroButtons";

/* =========================
   DATA
========================= */
const BotomCardData = [
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "2–4 hours delivery",
  },
  {
    icon: ShieldCheck,
    title: "100% Fresh",
    desc: "Quality guaranteed",
  },
  {
    icon: Clock,
    title: "24/7 Service",
    desc: "Always available",
  },
];

/* =========================
   ANIMATION VARIANTS (DRY)
========================= */
const textVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

/* =========================
   COMPONENT
========================= */
const Banner = () => {
  return (
    <div className="relative overflow-hidden bg-[#f6f7f6] xl:min-h-screen flex items-center">
      {/* 🌿 Background Glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[120px]" />
      <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-emerald-400/20 rounded-full blur-[120px]" />

      <div className="max-w-screen-2xl mx-auto px-5 w-full relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-4 py-16 xl:py-0 2xl:min-h-screen">
          {/* =========================
              LEFT CONTENT
          ========================= */}
          <div className="flex-1 text-center md:text-left space-y-6 md:space-y-8 w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border text-xs sm:text-sm text-green-700 font-medium">
              🥬 Fresh Grocery Delivery
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.1] text-gray-900">
              {/* ONE LINE */}
              <motion.div
                custom={1}
                variants={textVariant}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap md:flex-nowrap items-end gap-x-3 gap-y-2 justify-center md:justify-start"
              >
                <span className="block">Fresh & Organic</span>

                <span className="relative block text-[#106D42]">
                  Grocery
                  {/* ✨ marker style underline */}
                  <svg
                    className="absolute left-0 -bottom-2 w-full h-4 md:h-5"
                    viewBox="0 0 200 20"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M5 15 C 60 25, 140 5, 195 15"
                      stroke="black"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </motion.div>

              {/* NEXT LINE */}
              <motion.span
                custom={2}
                variants={textVariant}
                initial="hidden"
                animate="visible"
                className="block mt-2"
              >
                at Your Door
              </motion.span>
            </h1>

            {/* Description */}
            <motion.p
              custom={3}
              variants={textVariant}
              initial="hidden"
              animate="visible"
              className="text-gray-600 text-sm sm:text-base lg:text-lg mx-auto md:mx-0 leading-relaxed max-w-xl"
            >
              Get fresh vegetables, fruits, dairy, and daily essentials
              delivered straight to your doorstep within hours. We ensure
              premium quality, farm-fresh sourcing, and fast reliable delivery
              every day.
            </motion.p>

            {/* CTA BUTTONS */}
            <div className="flex justify-center md:justify-start">
              <HeroButtons />
            </div>

            {/* =========================
      FEATURE CARDS
  ========================= */}
            <div className="hidden xl:grid xl:grid-cols-3 gap-5 pt-8">
              {BotomCardData.map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                  className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition"
                >
                  <item.icon className="text-green-600 mb-2" />

                  <h3 className="font-semibold text-gray-900">{item.title}</h3>

                  <p className="text-sm text-gray-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* =========================
              RIGHT IMAGE
          ========================= */}
          <div className="flex-1 relative w-full hidden md:block md:h-[400px] lg:h-screen">
            {/* glow */}
            <div className="absolute bottom-0 w-[400px] h-[400px] bg-green-400/20 blur-[100px] rounded-full" />

            <Image
              src="/img/hero_2.png"
              alt="hero"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
