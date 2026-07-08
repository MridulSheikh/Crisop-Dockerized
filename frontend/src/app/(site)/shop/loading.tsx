import React from "react";

const ProductsSkeleton = () => {
  return (
    <div className="bg-[#f6f6f6] py-10 lg:py-20 animate-pulse">
      {/* Banner Skeleton */}
      <div className="max-w-screen-2xl mx-auto h-96 rounded-md bg-gray-300" />

      <div className="max-w-screen-2xl px-5 mx-auto pt-10">
        {/* Top bar */}
        <div className="flex justify-between items-center">
          <div className="h-4 w-40 bg-gray-300 rounded" />
          <div className="h-8 w-24 bg-gray-300 rounded" />
        </div>

        <div className="flex flex-col xl:flex-row gap-x-5 mt-[34px] w-full">
          {/* Sidebar Skeleton */}
          <div className="w-full xl:w-64 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-full bg-gray-300 rounded"
              />
            ))}
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid lg:grid-cols-4 gap-5 w-full">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-3 rounded-md shadow-sm"
              >
                {/* Image */}
                <div className="h-40 w-full bg-gray-300 rounded mb-3" />

                {/* Title */}
                <div className="h-4 w-3/4 bg-gray-300 rounded mb-2" />

                {/* Price */}
                <div className="h-4 w-1/2 bg-gray-300 rounded mb-3" />

                {/* Button */}
                <div className="h-8 w-full bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-10 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-8 bg-gray-300 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsSkeleton;