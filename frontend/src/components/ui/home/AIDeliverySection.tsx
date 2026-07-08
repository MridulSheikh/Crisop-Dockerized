"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const features = [
  {
    title: "Autonomous AI Robot Network",
    desc: "Self-operating delivery robots powered by real-time AI routing and smart navigation systems.",
    img: "/img/robot_delevery_boy_white_bg.png",
    tag: "AI Robotics",
  },
  {
    title: "High-Speed Drone Logistics",
    desc: "Next-gen aerial delivery system optimized for speed, efficiency, and urban scalability.",
    img: "/img/drone_delevery_white_bg.png",
    tag: "Drone Tech",
  },
];

/* =========================
   MODERN ANIMATION VARIANTS
========================= */

const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 60,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const cardVariant = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.96,
  },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const imageVariant = {
  hidden: {
    scale: 1.15,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const AIDeliverySection = () => {
  return (
    <section className="relative py-10 lg:py-28 overflow-hidden bg-[#f6f7f6] md:px-5 mt-10 md:mt-24">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-400/10 rounded-full blur-[120px]" />

      <div className="max-w-screen-2xl mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center space-y-6 mb-20"
        >

          <motion.p
            variants={fadeUp}
            className="text-xs md:text-sm font-medium tracking-[0.2em] text-emerald-700 uppercase"
          >
            Next Generation Delivery Platform
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-6xl font-semibold text-gray-900 leading-tight tracking-tight"
          >
            AI-powered logistics for modern delivery systems
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            We are building an intelligent delivery infrastructure combining
            robotics, drones, and predictive AI systems to redefine how goods
            move in cities.
          </motion.p>

        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-10">

          {features.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="group relative h-full"
            >

              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-100/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-3xl blur-2xl" />

              {/* Card */}
              <div className="relative h-full flex flex-col rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">

                {/* Content */}
                <div className="p-8 space-y-4 text-center flex-1">

                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                  >
                    {item.tag}
                  </motion.span>

                  <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed min-h-[72px]">
                    {item.desc}
                  </p>

                </div>

                {/* Image */}
                <motion.div
                  variants={imageVariant}
                  className="relative w-full aspect-[16/10] overflow-hidden"
                >
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default AIDeliverySection;