"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import { toast } from "react-toastify";
import {
  TOrder,
  usePostOrderUserMutation,
} from "@/redux/features/order/orderApi";
import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/features/cart/cartSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StripeForm from "@/components/payment/StripeForm";

const divisions = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barisal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];



export default function CheckoutPage() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const user = useAppSelector(useCurrentUser);
  const [createOrder] = usePostOrderUserMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    division: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user, cartItems]);

  // totals
  const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);

  const shipping = subtotal > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const isFormValid = Object.values(form).every((v) => v.trim() !== "");

  // COD order
  const handleCOD = async () => {
    try {
      if (!user?._id) {
        toast.error("User not logged in");
        return;
      }

      const payload = {
        customer: user._id,
        shippingInfo: {
          addressOneLine: `${form.address}, ${form.division}`,
          type: "Standard",
          contact: form.phone,
          email: form.email,
          division: form.division,
        },
        items: cartItems.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        isCod: true,
        isPaymentComplete: false,
        total: total,
      };

      const res = await createOrder(
        payload as Partial<TOrder<string>>,
      ).unwrap();

      toast.success("Order placed successfully!");

      if (res.success) {
        router.push("/order");
        dispatch(clearCart());
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "❌ Order failed");
    }
  };

  if (total <= 0) {
    return (
      <div className=" h-[80vh] w-full flex justify-center items-center">
        <div className=" p-6 rounded-lg text-center text-gray-500">
          Your cart is empty 🛒
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f6f6]">
      <div className="max-w-6xl pb-10 mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow space-y-6">
          <h2 className="text-lg font-semibold">Shipping Details</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Phone */}
            <div>
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            {/* Division */}
            <div>
              <Label>Division</Label>
              <select
                className="w-full border p-2 rounded-md"
                value={form.division}
                onChange={(e) => setForm({ ...form, division: e.target.value })}
              >
                <option value="">Select Division</option>
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>

          {/* PAYMENT */}
          <div>
            <Label>Payment Method</Label>

            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              disabled={!isFormValid}
              className="mt-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod">Cash on Delivery</Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe">Stripe Payment</Label>
              </div>
            </RadioGroup>
          </div>

          {/* COD BUTTON */}
          {paymentMethod === "cod" && (
            <Button
              onClick={handleCOD}
              disabled={!isFormValid}
              className="w-full bg-black text-white"
            >
              Confirm Order
            </Button>
          )}

          {/* STRIPE */}
          {paymentMethod === "stripe" && isFormValid && (
              <StripeForm total={total} form={form} cartItems={cartItems} />
          )}
        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-white p-6 rounded-xl shadow h-fit">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                {shipping > 0 ? <span>${shipping}</span> : <span>Free</span>}
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Items</h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.id || item.id}
                  className="flex gap-3 items-center border rounded-md p-2 bg-white"
                >
                  {/* IMAGE */}
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="rounded object-cover"
                    height={60}
                    width={60}
                  />

                  {/* INFO */}
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × ${item.price}
                    </p>
                  </div>

                  {/* PRICE */}
                  <div className="text-sm font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
