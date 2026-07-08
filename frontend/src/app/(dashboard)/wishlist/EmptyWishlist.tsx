"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

const EmptyWishlist = () => {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] w-full flex justify-center items-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-sm w-full">
        
        {/* Image */}
        <div className="flex justify-center mb-4">
          <Image
            src="/img/empty-wishlist.png" 
            alt="Empty Wishlist"
            width={150}
            height={150}
            className="opacity-90"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
          <Heart className="text-red-500" size={20} />
          Your wishlist is empty
        </h2>

        {/* Subtitle */}
        <p className="text-sm text-gray-500 mt-2">
          Save your favorite items here ❤️ <br />
          Tap the heart icon on products you love.
        </p>

        {/* CTA */}
        <Button
          onClick={() => router.push("/shop")}
          className="mt-5 w-full bg-green-600 hover:bg-green-700"
        >
          Discover Products
        </Button>
      </div>
    </div>
  );
};

export default EmptyWishlist;