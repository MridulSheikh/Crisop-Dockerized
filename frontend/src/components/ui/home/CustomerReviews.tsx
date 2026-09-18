"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BadgeCheck, Quote, Star } from "lucide-react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface Review {
  id: string;
  name: string;
  location: string;
  initials: string;
  color: string;
  review: string;
  rating: number;
}

const REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Nusrat Jahan",
    location: "Dhanmondi, Dhaka",
    initials: "NJ",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    review:
      "The vegetables arrived incredibly fresh and carefully packed. Crisop has made my weekly grocery shopping so much easier.",
    rating: 5,
  },
  {
    id: "rev-2",
    name: "Rahim Ahmed",
    location: "Uttara, Dhaka",
    initials: "RA",
    color: "bg-sky-100 text-sky-700 border-sky-200",
    review:
      "Fast delivery, excellent quality, and the ordering process is effortless. I especially love the reliable delivery updates.",
    rating: 5,
  },
  {
    id: "rev-3",
    name: "Sadia Islam",
    location: "Bashundhara, Dhaka",
    initials: "SI",
    color: "bg-violet-100 text-violet-700 border-violet-200",
    review:
      "Everything from fruit to daily essentials is consistently fresh. It feels like having a trusted neighbourhood shop online.",
    rating: 5,
  },
  {
    id: "rev-4",
    name: "Tanvir Hasan",
    location: "Mirpur, Dhaka",
    initials: "TH",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    review:
      "Great service and great value. My order came within a few hours, and the products were exactly as described.",
    rating: 5,
  },
];

const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.06,
      duration: 0.45,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

const CustomerReviews = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <section className="relative overflow-hidden bg-slate-50/50 py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f012_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f012_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto mb-10 max-w-2xl text-center sm:mb-12"
        >
          <span className="mb-3 inline-flex items-center rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 backdrop-blur-sm">
            Customer Stories
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Fresh Groceries, Happy Homes
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Real experiences from real people who rely on Crisop for their daily essentials.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto mb-12 flex max-w-lg flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-center shadow-sm backdrop-blur-sm sm:flex-row sm:gap-6"
        >
          <div
            className="flex items-center gap-1 text-amber-400"
            aria-label="Rating: 5 out of 5 stars"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <div className="hidden h-5 w-px bg-slate-200 sm:block" />
          <div className="text-xs text-slate-600 sm:text-sm">
            <strong className="font-bold text-slate-900">4.9 / 5.0 Rating</strong>
            <span className="ml-1 text-slate-500">from 2,000+ happy shoppers</span>
          </div>
        </motion.div>

        {/* Reviews Carousel Container */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: REVIEWS.length > 3,
            }}
            className="w-full cursor-grab active:cursor-grabbing"
          >
            <CarouselContent className="-ml-3 md:-ml-4">
              {REVIEWS.map((item, index) => (
                <CarouselItem
                  key={item.id}
                  className="pl-3 sm:basis-1/2 lg:basis-1/3 md:pl-4"
                >
                  <motion.figure
                    custom={index}
                    variants={cardAnimation}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
                  >
                    <div>
                      {/* Card Header: Icon & Stars */}
                      <div className="mb-5 flex items-center justify-between">
                        <span className="inline-flex rounded-xl bg-emerald-50 p-2.5 text-emerald-700 transition-colors group-hover:bg-emerald-100">
                          <Quote className="h-4 w-4 fill-emerald-200" />
                        </span>
                        <div
                          className="flex gap-0.5 text-amber-400"
                          aria-label={`Rated ${item.rating} out of 5 stars`}
                        >
                          {Array.from({ length: item.rating }, (_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      {/* Review Text */}
                      <blockquote className="text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                        “{item.review}”
                      </blockquote>
                    </div>

                    {/* Reviewer Profile */}
                    <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                      <div
                        aria-hidden="true"
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xs font-bold ${item.color}`}
                      >
                        {item.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate text-sm font-semibold text-slate-900">
                            {item.name}
                          </h3>
                          <BadgeCheck
                            className="h-4 w-4 shrink-0 fill-emerald-600 text-white"
                            aria-label="Verified Customer"
                          />
                        </div>
                        <p className="truncate text-xs text-slate-500">
                          {item.location}
                        </p>
                      </div>
                    </figcaption>
                  </motion.figure>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Carousel Navigation Buttons */}
            <CarouselPrevious className="-left-4 sm:-left-5 lg:-left-6 top-1/2 h-11 w-11 -translate-y-1/2 border-slate-200 bg-white/90 shadow-md backdrop-blur-sm transition-all hover:border-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-0" />
            <CarouselNext className="-right-4 sm:-right-5 lg:-right-6 top-1/2 h-11 w-11 -translate-y-1/2 border-slate-200 bg-white/90 shadow-md backdrop-blur-sm transition-all hover:border-emerald-600 hover:bg-emerald-600 hover:text-white disabled:opacity-0" />
          </Carousel>

          {/* Dynamic Mobile Indicator Dots */}
          {count > 1 && (
            <div className="mt-6 flex justify-center gap-1.5 sm:hidden">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    current === i
                      ? "w-6 bg-emerald-600"
                      : "w-2 bg-slate-200 hover:bg-slate-300"
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;