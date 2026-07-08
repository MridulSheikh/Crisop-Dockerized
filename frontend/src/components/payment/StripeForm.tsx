"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { useCreatePaymentIntentMutation } from "@/redux/features/payment/paymentApi";
import { CartItem, clearCart } from "@/redux/features/cart/cartSlice";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import { TOrder, TOrderItem, usePostOrderUserMutation } from "@/redux/features/order/orderApi";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { TProduct } from "@/types/user";

function StripeForm({ total, form, cartItems }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const user = useAppSelector(useCurrentUser);
  const [createOrder] = usePostOrderUserMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const [createPaymentIntent, { isLoading }] = useCreatePaymentIntentMutation();

  const handleStripePayment = async () => {
    if (!user?._id) {
      toast.error("User not logged in");
      return;
    }
    if (!stripe || !elements) return;

    const toastId = toast.loading("Processing payment...");

    try {
      // normalize item data
      const normalizeCartItems = cartItems.map((item: CartItem) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      // create payment intent
      const res = await createPaymentIntent({
        items: normalizeCartItems,
      }).unwrap();

      const clientSecret = res.data.clientSecret;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      // confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        },
      );

      if (error) {
        toast.update(toastId, {
          render: error.message,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      // success
      if (paymentIntent?.status === "succeeded") {
        toast.update(toastId, {
          render: "Payment successful 🎉",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
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
        items: cartItems.map((item: TOrderItem<TProduct>) => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        isCod: false,
        isPaymentComplete: true,
        total: total,
      };

      const res2 = await createOrder(
        payload as Partial<TOrder<string>>,
      ).unwrap();

       toast.update(toastId, {
          render: "Order successfully placed",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

      if (res2.success) {
        router.push("/order");
        dispatch(clearCart());
      }
    } catch (err: any) {
      toast.update(toastId, {
        render:
          err.data?.errorDetails?.message?.slice(0, 100) || "Payment failed ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="border p-3 rounded-md">
        <CardElement />
      </div>

      <Button
        onClick={handleStripePayment}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {isLoading ? "Processing..." : `Pay $${total}`}
      </Button>
    </div>
  );
}

export default StripeForm;
