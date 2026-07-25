"use client";

import Image from "next/image";
import React from "react";
import { Truck, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";
import HeroButtons from "./HeroButtons";

// bottom card data
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

// animation variant's
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

// componenet
const Banner = () => {
  return (
    <div className="relative overflow-hidden bg-[#f6f7f6] md:min-h-screen flex items-center justify-center py-8 lg:py-0">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-green-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 py-6 sm:py-10 xl:pb-0">
          {/* Left content card */}
          <div className="flex-1 text-center md:text-left space-y-4 lg:space-y-6 w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-yellow-500/20 shadow-sm border text-xs sm:text-sm text-yellow-700 font-medium">
              🥬 Fresh Grocery Delivery
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-[1.15] text-gray-900">
              {/* FIRST LINE */}
              <motion.div
                custom={1}
                variants={textVariant}
                initial="hidden"
                animate="visible"
                className="block text-center md:text-left"
              >
                {/* Plain Text */}
                <span className="inline">Fresh & Organic </span>

                {/* Highlighted Word with Underline */}
                <span className="relative inline-block text-[#106D42]">
                  Grocery
                  {/* ✨ marker style underline */}
                  <svg
                    className="absolute left-0 -bottom-1.5 w-full h-3 md:h-4 lg:h-5 pointer-events-none"
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
                className="block mt-1 sm:mt-2"
              >
                at Your Door.
              </motion.span>
            </h1>

            {/* Description */}
            <motion.p
              custom={3}
              variants={textVariant}
              initial="hidden"
              animate="visible"
              className="text-gray-600 text-sm mx-auto md:mx-0 leading-relaxed max-w-xl"
            >
              Get fresh vegetables, fruits, dairy, and daily essentials
              delivered straight to your doorstep within hours. We ensure
              premium quality, farm-fresh sourcing, and fast reliable delivery
              every day.
            </motion.p>

            {/* CTA BUTTONS */}
            <div className="flex justify-center md:justify-start pt-2">
              <HeroButtons />
            </div>

            {/* FEATURE CARDS */}
            <div className="hidden xl:flex items-center gap-8 pt-6">
              {BotomCardData.map((item, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-3.5"
                >
                  {/* Circle Green Icon Wrapper */}
                  <div className="shrink-0 w-12 h-12 rounded-full bg-[#106D42] text-white flex items-center justify-center">
                    <item.icon className="w-6 h-6 stroke-[1.8]" />
                  </div>

                  {/* Title & Description */}
                  <div className="flex flex-col">
                    <h3 className="font-bold text-gray-900 text-base leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-normal leading-normal mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE CONTAINER */}
          <div className="flex-1 relative w-full hidden md:flex items-end justify-center self-stretch min-h-[400px] lg:min-h-screen">
            {/* glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] bg-green-400/20 blur-[100px] rounded-full pointer-events-none" />

            <Image
              src="/img/hero_2.png"
              alt="hero"
              fill
              className="object-contain !object-bottom"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
