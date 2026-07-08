"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { VscHeartFilled } from "react-icons/vsc";
import { TBrand, TProduct } from "@/types/user";
import DOMPurify from "dompurify";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { handleAddToCartUtil } from "@/utils/cart/handleAddToCart";
import { toggleWishlist } from "@/redux/features/wishlist/wishListSlice";
import { toast } from "react-toastify";

export default function ProductDetailsClient({
  product,
}: {
  product: TProduct;
}) {
  const {
    name,
    description,
    category,
    images,
    stock,
    price,
    discountPrice,
    brand,
  } = product;

  const dispatch = useAppDispatch();

  // 🛒 cart
  const cartItems = useAppSelector((state) => state.cart.items);

  // ❤️ wishlist (GLOBAL STATE)
  const wishlistItems = useAppSelector((state) => state.wishlist.products);
  const isWishlisted = wishlistItems.includes(product._id);

  // UI states
  const [quantity, setQuantity] = useState(1);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  // carousel
  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // quantity handlers
  const increment = () => {
    if (quantity < stock.quantity) setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // sanitize HTML
  const createMarkup = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  // 🛒 add to cart
  const handleAddToCart = async () => {
    try {
      setLoading(true);

      await handleAddToCartUtil({
        product,
        quantity,
        cartItems,
        dispatch,
      });
    } finally {
      setLoading(false);
    }
  };

  // ❤️ wishlist toggle
  const handleToggleWishlist = () => {
    if (wishLoading) return;

    setWishLoading(true);

    if (isWishlisted) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }

    dispatch(toggleWishlist(product._id));

    setTimeout(() => {
      setWishLoading(false);
    }, 300); // small debounce feel
  };

  return (
    <div className="min-h-screen text-foreground lg:pt-20 relative">
      {/* background gradient layer */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-50 via-white to-emerald-50" />

      {/* soft glow blobs */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-green-200/30 blur-3xl rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-200/30 blur-3xl rounded-full -z-10" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* IMAGE */}
          <div className="space-y-4">
            <Carousel setApi={setApi}>
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-square rounded-lg border bg-muted overflow-hidden">
                      <Image
                        src={img.url}
                        alt={name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* thumbnails */}
            <div className="flex gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-14 w-14 rounded-md border overflow-hidden ${
                    current === index ? "border-green-600" : "border-border"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt=""
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* INFO */}
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground uppercase tracking-widest">
              {category.name}
            </p>

            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-semibold">{name}</h1>

              {/* ❤️ Wishlist */}
              <button
                onClick={handleToggleWishlist}
                disabled={wishLoading}
                className="transition"
              >
                {isWishlisted ? (
                  <VscHeartFilled className="text-red-500 text-2xl scale-110 transition" />
                ) : (
                  <Heart className="text-muted-foreground text-2xl hover:text-red-500 transition" />
                )}
              </button>
            </div>

            {/* BRAND */}
            {brand && (
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 overflow-hidden border relative">
                  <Image
                    src={(brand as TBrand).img?.url || " "}
                    alt={(brand as TBrand).name}
                    fill
                    className="object-contain object-center"
                  />
                </div>

                <span className="text-sm text-muted-foreground">
                  {(brand as TBrand).name}
                </span>
              </div>
            )}

            {/* price */}
            <div>
              {discountPrice && discountPrice < price ? (
                <div className="flex gap-3 items-center">
                  <span className="text-2xl font-bold">
                    ${discountPrice.toFixed(2)}
                  </span>
                  <span className="line-through text-muted-foreground">
                    ${price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold">${price.toFixed(2)}</span>
              )}

              <span className="text-sm text-muted-foreground ml-2">
                Per {stock.unit}
              </span>
            </div>

            {/* stock */}
            <div>
              {stock.quantity > 0 ? (
                <span className="text-green-600">
                  In Stock ({stock.quantity})
                </span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </div>

            {/* quantity + cart */}
            <div className="flex gap-3">
              <div className="flex border rounded-md">
                <button
                  onClick={decrement}
                  disabled={quantity <= 1}
                  className="px-3"
                >
                  -
                </button>
                <input value={quantity} readOnly className="w-10 text-center" />
                <button
                  onClick={increment}
                  disabled={quantity >= stock.quantity}
                  className="px-3"
                >
                  +
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={stock.quantity === 0 || loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw size={18} className="animate-spin" />
                    Adding...
                  </span>
                ) : (
                  <>
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>

            {/* trust */}
            <div className="grid grid-cols-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck size={16} /> Free Shipping
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} /> Warranty
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw size={16} /> Return
              </div>
            </div>
          </div>
        </div>

        {/* description */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>

          <div
            className="prose prose-sm max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={createMarkup(description as string)}
          />
        </div>
      </div>
    </div>
  );
}
