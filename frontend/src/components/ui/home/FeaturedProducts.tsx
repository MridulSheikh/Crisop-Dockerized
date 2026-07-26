"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

import ProductCard from "@/components/shared/card/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useGetFeaturedProductsQuery } from "@/redux/features/product/productApi";
import { Button } from "@/components/ui/button";

// Smooth, subtle staggered motion variants
const cardAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.4,
      ease: [0.215, 0.61, 0.355, 1], // Cubic-bezier for slick ease-out
    },
  }),
};

// High-fidelity Skeleton loader matching exact ProductCard dimensions
const ProductSkeleton = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
    <div className="relative aspect-square w-full animate-pulse rounded-xl bg-gray-100" />
    <div className="mt-4 flex flex-1 flex-col justify-between space-y-3 px-1 pb-1">
      <div className="space-y-2">
        <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-5 w-1/4 animate-pulse rounded bg-gray-100" />
        <div className="h-9 w-20 animate-pulse rounded-lg bg-gray-100" />
      </div>
    </div>
  </div>
);

const FeaturedProducts = () => {
  const { data, isLoading, isError } = useGetFeaturedProductsQuery({
    page: 1,
    limit: 8,
  });

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const featuredProducts = data?.data ?? [];

  // Track Carousel State for Dots Navigation
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
    <section
      id="featured-products"
      className="relative overflow-hidden bg-gradient-to-b from-gray-50/50 via-white to-white py-16 md:py-24"
    >
      {/* Background Decoratives */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-emerald-200/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-lime-200/20 blur-[120px]" />

      <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 text-center sm:mb-14"
        >
          <div className="mx-auto max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              Handpicked For You
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Featured Products
            </h2>
            <p className="text-sm text-gray-600 sm:text-base">
              Discover our top-rated favorites and daily essentials selected for quality, sustainability, and value.
            </p>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          /* Error Fallback State */
          <div className="mx-auto max-w-md rounded-2xl border border-rose-100 bg-rose-50/50 p-8 text-center backdrop-blur-sm">
            <p className="text-sm font-medium text-rose-800">
              Unable to load featured products at this time.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="mt-4 border-rose-200 text-rose-800 hover:bg-rose-100"
            >
              Try Again
            </Button>
          </div>
        ) : featuredProducts.length > 0 ? (
          /* Carousel State */
          <div className="relative">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: featuredProducts.length > 4,
              }}
              className="w-full cursor-grab active:cursor-grabbing"
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {featuredProducts.slice(0, 8).map((product, index) => (
                  <CarouselItem
                    key={product._id}
                    className="pl-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 md:pl-4"
                  >
                    <motion.div
                      custom={index}
                      variants={cardAnimation}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      className="h-full py-1"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation Controls */}
              <CarouselPrevious className="-left-4 sm:-left-5 lg:-left-6 top-1/2 h-11 w-11 -translate-y-1/2 border-gray-200/80 bg-white/90 shadow-lg backdrop-blur-sm hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-0" />
              <CarouselNext className="-right-4 sm:-right-5 lg:-right-6 top-1/2 h-11 w-11 -translate-y-1/2 border-gray-200/80 bg-white/90 shadow-lg backdrop-blur-sm hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-0" />
            </Carousel>

            {/* Pagination Indicators */}
            {count > 1 && (
              <div className="mt-6 flex justify-center gap-1.5 sm:hidden">
                {Array.from({ length: count }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => api?.scrollTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      current === i
                        ? "w-6 bg-emerald-600"
                        : "w-2 bg-gray-200 hover:bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-gray-200 bg-white/80 px-6 py-12 text-center shadow-sm backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              New favorites arriving soon
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              We&apos;re currently restocking our featured list. Check back soon or explore our full catalog.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              Browse Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Section Footer / CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-emerald-800 hover:shadow-lg active:scale-[0.98]"
          >
            Explore All Products
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;