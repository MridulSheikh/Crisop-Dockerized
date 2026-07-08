"use client";

import React from "react";

const ProductDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-background mt-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* IMAGE SECTION */}
          <div className="space-y-4">
            {/* main image */}
            <div className="aspect-square rounded-lg bg-gray-300" />

            {/* thumbnails */}
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 w-14 bg-gray-300 rounded-md"
                />
              ))}
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="space-y-6">
            {/* category */}
            <div className="h-3 w-24 bg-gray-300 rounded" />

            {/* title */}
            <div className="h-8 w-3/4 bg-gray-300 rounded" />

            {/* price */}
            <div className="h-6 w-40 bg-gray-300 rounded" />

            {/* stock */}
            <div className="h-4 w-32 bg-gray-300 rounded" />

            {/* quantity + button */}
            <div className="flex gap-3">
              <div className="h-10 w-28 bg-gray-300 rounded" />
              <div className="h-10 flex-1 bg-gray-300 rounded" />
            </div>

            {/* trust icons */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded" />
              ))}
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-16 space-y-4">
          <div className="h-6 w-40 bg-gray-300 rounded" />

          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-300 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;