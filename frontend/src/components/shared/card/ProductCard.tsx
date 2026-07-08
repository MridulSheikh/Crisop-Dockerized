"use client";

import { TBrand, TProduct } from "@/types/user";
import { getDiscountPercentage } from "@/utils/getDiscountPercentage";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { handleAddToCartUtil } from "@/utils/cart/handleAddToCart";
import { toggleWishlist } from "@/redux/features/wishlist/wishListSlice";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: TProduct }) => {
  const dispatch = useAppDispatch();

  // 🛒 Cart
  const cartItems = useAppSelector((state) => state.cart.items);

  // brand
  const brand = product.brand as TBrand;

  // ❤️ Wishlist
  const wishlistItems = useAppSelector((state) => state.wishlist.products);
  const isWishlisted = wishlistItems.includes(product._id);

  // 💸 Discount
  const discountPercentage = getDiscountPercentage(
    product?.price,
    product?.discountPrice as number,
  );

  // 🛒 Add to cart
  const handleAddToCart = async () => {
    await handleAddToCartUtil({
      product,
      quantity: 1,
      cartItems,
      dispatch,
    });
  };

  // ❤️ Toggle wishlist
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }

    dispatch(toggleWishlist(product._id));
  };

  return (
    <div className="group rounded-md border border-gray-200 bg-white hover:shadow-[0px_4px_41px_6px_rgba(0,_0,_0,_0.1)] transition-all duration-500 overflow-hidden">
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        {discountPercentage !== 0 && (
          <div className="bg-red-600 inline p-0.5 absolute top-0 left-0 text-white text-sm z-10">
            -{discountPercentage}%
          </div>
        )}

        {brand && (
          <div className=" inline absolute top-0 right-1  text-sm z-10">
            <div className="relative w-10 h-10 rounded-md overflow-hidden">
              <Image
                src={brand.img?.url || "/placeholder.png"}
                alt={brand.name}
                fill
                className=" object-contain"
              />
            </div>
          </div>
        )}

        <Link href={`/shop/${product?._id}`}>
          <div className=" h-28 md:h-60 lg:h-56 w-full relative overflow-hidden">
            <Image
              src={product?.images[0]?.url}
              alt={product?.name}
              fill
              className="object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />
          </div>
        </Link>
      </div>

      {/* CONTENT */}
      <div className="p-2 md:p-5">
        {/* TITLE */}
        <div className="text-center">
          <h1 className="text-md font-semibold">{product?.name}</h1>

          <h2 className="mt-3 text-sm xl:group-hover:hidden">
            <span className="line-through text-gray-500">
              ${product?.price}
            </span>{" "}
            <span className="font-bold">${product?.discountPrice}</span> (Per{" "}
            {product?.stock.unit})
          </h2>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-center space-x-3 mt-5 xl:opacity-0 xl:translate-y-3 xl:group-hover:opacity-100 xl:group-hover:translate-y-0 transition-all duration-300 ease-in-out">
          {/* ❤️ Wishlist */}
          <button
            onClick={handleToggleWishlist}
            className={`size-10 flex justify-center items-center rounded-full transition ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-slate-200 hover:bg-green-700 hover:text-white"
            }`}
          >
            <Heart
              className="size-5"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>

          {/* 🛒 Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock.quantity === 0}
            className="size-10 flex justify-center items-center rounded-full bg-slate-200 hover:bg-green-700 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="size-5" />
          </button>

          {/* 👁 View */}
          <Link href={`/shop/${product?._id}`}>
            <button className="size-10 flex justify-center items-center rounded-full bg-slate-200 hover:bg-green-700 hover:text-white transition">
              <Eye className="size-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
