"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

/* =========================
   DATA
========================= */
const categories = [
  {
    name: "Vegetables",
    img: "/img/vagitable_category.png",
    large: true,
  },
  {
    name: "Meat",
    img: "/img/meat_category.png",
  },
  {
    name: "Fruits",
    img: "/img/fruits_category.png",
  },
  {
    name: "Fish",
    img: "/img/fish_category.png",
    large: true,
  },
];

/* =========================
   REUSABLE ANIMATION
========================= */
const fadeUpVariant = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

/* =========================
   REUSABLE CARD
========================= */
const CategoryCard = ({
  item,
  className,
  index,
}: {
  item: {
    name: string;
    img: string;
  };
  className?: string;
  index: number;
}) => {
  return (
    <motion.div
      custom={index}
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={cn(
        "relative rounded-3xl overflow-hidden group",
        className
      )}
    >
      {/* Image */}
      <Image
        src={item.img}
        alt={item.name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6">
        <h1 className="text-white text-2xl md:text-3xl font-semibold tracking-tight">
          {item.name}
        </h1>

        <p className="text-white/80 text-sm mt-1">
          Fresh premium quality products
        </p>
      </div>
    </motion.div>
  );
};

/* =========================
   COMPONENT
========================= */
const OurCategories = () => {
  return (
    <section
      id="categories"
      className="max-w-screen-2xl mx-auto px-5 mt-10 md:mt-28"
    >
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl xl:text-5xl 2xl:text-6xl font-semibold tracking-tight text-gray-900">
          Our Top Categories
        </h1>

        <p className="mt-4 text-gray-500 lg:max-w-2xl mx-auto text-sm lg:text-lg leading-relaxed">
          Fresh groceries, meat, fish and fruits delivered with premium quality.
          Choose your favorite category and start shopping.
        </p>
      </motion.div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* LEFT BIG */}
          <CategoryCard
            item={categories[0]}
            index={1}
            className="h-[260px] lg:h-[560px]"
          />

        {/* MIDDLE */}
        <div className="grid gap-6">

          {[categories[1], categories[2]].map((item, i) => (
            <CategoryCard
              key={i}
              item={item}
              index={i + 2}
              className={cn(
                "h-[220px] lg:h-[268px]",
                {
                  "md:hidden lg:block": i === 1,
                }
              )}
            />
          ))}

        </div>

        {/* RIGHT BIG */}
        <CategoryCard
          item={categories[3]}
          index={5}
          className="h-[260px] lg:h-[560px]"
        />

        {/* Tablet Fix */}
        <CategoryCard
          item={categories[2]}
          index={6}
          className="hidden md:block lg:hidden h-[260px]"
        />

      </div>
    </section>
  );
};

export default OurCategories;