"use client";

import React from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeFromCart, addToCart } from "@/redux/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import EmptyCart from "./EmptyCart";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  // total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDecrease = (item: any) => {
    if (item.quantity <= 1) {
      dispatch(removeFromCart(item.id));
    } else {
      dispatch(addToCart({ ...item, quantity: -1 }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 ">
      <h1 className="text-xl md:text-2xl font-semibold">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 mt-5">
          {/* LEFT - CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-4 md:items-center"
              >
                {/* IMAGE */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto md:mx-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                {/* DETAILS */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="font-medium text-sm md:text-base">
                    {item.name}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">
                    ${item.price.toFixed(2)}
                  </p>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                    <button
                      className="p-1 border rounded"
                      onClick={() => handleDecrease(item)}
                    >
                      <Minus size={14} />
                    </button>

                    <span className="px-3 text-sm md:text-base">
                      {item.quantity}
                    </span>

                    <button
                      className="p-1 border rounded"
                      onClick={() =>
                        dispatch(addToCart({ ...item, quantity: 1 }))
                      }
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* PRICE + REMOVE */}
                <div className="text-center md:text-right mt-2 md:mt-0">
                  <p className="font-semibold text-sm md:text-base">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-red-500 mt-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT - SUMMARY */}
          <div className="bg-white p-6 rounded-xl shadow h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>

              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Link href={"/checkout"}>
              <Button className="w-full mt-5 bg-green-600 hover:bg-green-700">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
