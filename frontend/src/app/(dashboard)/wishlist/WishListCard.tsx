"use client";

import React from "react";
import Image from "next/image";
import { useGetSingleProductQuery } from "@/redux/features/product/productApi";
import { TProduct } from "@/types/user";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toast } from "react-toastify";
import { toggleWishlist } from "@/redux/features/wishlist/wishListSlice";
import { handleAddToCartUtil } from "@/utils/cart/handleAddToCart";

const WishListCard = ({ id }: { id: string }) => {
  const { data, isLoading, isError } = useGetSingleProductQuery(id);
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);
  const wishlistItems = useAppSelector((state) => state.wishlist.products);

  const isWishlisted = wishlistItems.includes(id);

  if (isLoading) {
    return (
      <div className="p-4 border rounded-xl animate-pulse">
        Loading...
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="p-4 border rounded-xl text-red-500">
        Something went wrong
      </div>
    );
  }

  console.log(id)

  const product = data.data as TProduct;
  const inStock = product.stock.quantity > 0;

  const handleAddToCart = async () => {
    await handleAddToCartUtil({
      product,
      quantity: 1,
      cartItems,
      dispatch,
    });
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const toastId = toast.loading("Updating wishlist...");

    try {
      dispatch(toggleWishlist(id));

      toast.update(toastId, {
        render: isWishlisted
          ? "Removed from wishlist"
          : "Added to wishlist",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch {
      toast.update(toastId, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="h-full flex">
      <div className="w-full border rounded-2xl shadow-sm hover:shadow-md transition bg-white flex flex-col">

        {/* IMAGE */}
        <div className="relative w-full h-40 sm:h-44 md:h-48">
          <Image
            src={product?.images?.[0]?.url || "/placeholder.png"}
            alt={product?.name}
            fill
            className="object-cover rounded-t-2xl"
          />

          <span
            className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full text-white ${
              inStock ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* CONTENT */}
        <div className="p-3 sm:p-4 flex flex-col gap-3 flex-1">

          {/* TITLE */}
          <h2 className="text-base sm:text-lg font-semibold line-clamp-1">
            {product?.name}
          </h2>

          {/* INFO BOX */}
          <div className="text-xs sm:text-sm border rounded-lg divide-y">
            
            {/* PRICE */}
            <div className="flex justify-between p-2">
              <span className="text-gray-500">Price</span>
              <div className="flex gap-2">
                <span className="font-semibold text-green-600">
                  ${product?.discountPrice || product?.price}
                </span>

                {product?.discountPrice && (
                  <span className="line-through text-gray-400">
                    ${product?.price}
                  </span>
                )}
              </div>
            </div>

            {/* STOCK */}
            <div className="flex justify-between p-2">
              <span className="text-gray-500">Stock</span>
              <span className="font-medium">
                {product?.stock.quantity}
              </span>
            </div>

            {/* CATEGORY */}
            {product?.category && (
              <div className="flex justify-between p-2">
                <span className="text-gray-500">Category</span>
                <span className="font-medium">
                  {product.category.name}
                </span>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2 mt-auto">

            {/* ADD TO CART */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`flex-1 py-2 rounded-lg text-sm transition ${
                inStock
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>

            {/* WISHLIST */}
            <button
              onClick={handleToggleWishlist}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 hover:bg-red-500 hover:text-white"
              }`}
            >
              ♥
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishListCard;