"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, ShieldCheck, Truck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import HeroButtons from "./HeroButtons";

const slides = [
  {
    badge: "🥬 Fresh Grocery Delivery",
    title: "Fresh & Organic",
    highlight: "Grocery",
    suffix: "at Your Door.",
    description:
      "Get fresh vegetables, fruits, dairy, and daily essentials delivered straight to your doorstep within hours.",
    image: "/img/hero_2.png",
    imageAlt: "Fresh groceries ready for delivery",
  },
  {
    badge: "⚡ Same-day delivery",
    title: "Daily Essentials",
    highlight: "Delivered",
    suffix: "with Care.",
    description:
      "From pantry staples to farm-fresh favourites, shop what you need and receive it quickly and reliably.",
    image: "/img/hero_3.png",
    imageAlt: "Crisop delivery robot",
  },
  {
    badge: "🌿 Quality you can trust",
    title: "Better Food for",
    highlight: "Everyday",
    suffix: "Living.",
    description:
      "Discover quality products from trusted sources, carefully selected to make everyday shopping simpler.",
    image: "/img/hero_5.png",
    imageAlt: "Crisop delivery drone",
  },
];

const bottomCardData = [
  { icon: Truck, title: "Fast Delivery", desc: "2–4 hours delivery" },
  { icon: ShieldCheck, title: "100% Fresh", desc: "Quality guaranteed" },
  { icon: Clock, title: "24/7 Service", desc: "Always available" },
];

const textVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Banner() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  const slide = slides[activeSlide];
  const showPrevious = () =>
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length);
  const showNext = () =>
    setActiveSlide((current) => (current + 1) % slides.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Crisop highlights"
      className="relative flex min-h-[620px] items-center justify-center overflow-hidden bg-[#f6f7f6] py-8 md:min-h-screen lg:py-0"
    >
      <div className="pointer-events-none absolute right-[45%] top-[45%] h-[300px] w-[300px] rounded-full bg-emerald-400/20 blur-[120px] sm:h-[400px] sm:w-[400px]" />

      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center gap-8 py-6 sm:py-10 md:flex-row lg:gap-12 xl:pb-0"
          >
            <div className="w-full flex-1 space-y-4 text-center md:text-left lg:space-y-6">
              <motion.div custom={1} variants={textVariant} initial="hidden" animate="visible" className="inline-flex items-center gap-2 rounded-full border bg-yellow-500/20 px-3 py-1.5 text-xs font-medium text-yellow-700 shadow-sm sm:px-4 sm:py-2 sm:text-sm">
                {slide.badge}
              </motion.div>

              <h1 className="text-3xl font-bold leading-[1.15] text-gray-900 sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
                <motion.span custom={2} variants={textVariant} initial="hidden" animate="visible" className="block">
                  {slide.title} <span className="relative inline-block text-[#106D42]">{slide.highlight}<svg className="pointer-events-none absolute -bottom-1.5 left-0 h-3 w-full md:h-4 lg:h-5" viewBox="0 0 200 20" fill="none" preserveAspectRatio="none"><path d="M5 15 C 60 25, 140 5, 195 15" stroke="black" strokeWidth="6" strokeLinecap="round" /></svg></span>
                </motion.span>
                <motion.span custom={3} variants={textVariant} initial="hidden" animate="visible" className="mt-1 block sm:mt-2">{slide.suffix}</motion.span>
              </h1>

              <motion.p custom={4} variants={textVariant} initial="hidden" animate="visible" className="mx-auto max-w-xl text-sm leading-relaxed text-gray-600 md:mx-0">
                {slide.description}
              </motion.p>

              <motion.div custom={5} variants={textVariant} initial="hidden" animate="visible" className="flex justify-center pt-2 md:justify-start">
                <HeroButtons />
              </motion.div>

              <div className="hidden items-center gap-8 pt-6 xl:flex">
                {bottomCardData.map((item) => (
                  <div key={item.title} className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#106D42] text-white"><item.icon className="h-6 w-6 stroke-[1.8]" /></div>
                    <div><h2 className="text-base font-bold leading-snug text-gray-900">{item.title}</h2><p className="mt-0.5 text-xs leading-normal text-gray-500">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative hidden min-h-[400px] w-full flex-1 items-end justify-center self-stretch md:flex lg:min-h-screen">
              <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-green-400/20 blur-[100px] lg:h-[400px] lg:w-[400px]" />
              <Image src={slide.image} alt={slide.imageAlt} fill priority={activeSlide === 0} className="!object-bottom object-contain" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 md:bottom-8">
        {/* <button type="button" onClick={showPrevious} aria-label="Previous slide" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-700 shadow-sm transition hover:bg-white"><ChevronLeft size={18} /></button> */}
        <div className="flex gap-2" role="tablist" aria-label="Choose banner slide">
          {slides.map((item, index) => <button key={item.title} type="button" role="tab" aria-selected={index === activeSlide} aria-label={`Show slide ${index + 1}`} onClick={() => setActiveSlide(index)} className={`h-2.5 rounded-full transition-all ${index === activeSlide ? "w-7 bg-[#106D42]" : "w-2.5 bg-gray-300 hover:bg-gray-400"}`} />)}
        </div>
        {/* <button type="button" onClick={showNext} aria-label="Next slide" className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/80 text-gray-700 shadow-sm transition hover:bg-white"><ChevronRight size={18} /></button> */}
      </div>
    </section>
  );
}
