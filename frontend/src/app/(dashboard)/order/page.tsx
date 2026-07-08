"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import TimeStamp from "react-timestamp"

import {
  useCancelOrderMutation,
  useGetMyOrdersQuery,
} from "@/redux/features/order/orderApi";
import { toast } from "react-toastify";

// status

const ORDER_STEPS = [
  { key: "pending", label: "Pending", icon: "🕒" },
  { key: "packing", label: "Packing", icon: "📦" },
  { key: "shipped", label: "Shipped", icon: "🚚" },
  { key: "delivered", label: "Delivered", icon: "✅" },
];

// Time line

const OrderTimeline = ({ status }: { status: string }) => {
  const currentIndex = ORDER_STEPS.findIndex((s) => s.key === status);

  const progress =
    currentIndex === -1 ? 0 : (currentIndex / (ORDER_STEPS.length - 1)) * 112;

  return (
    <div className="mt-4">
      {/* progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* steps */}
      <div className="flex justify-between text-xs">
        {ORDER_STEPS.map((step, index) => {
          const isDone = index <= currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-lg transition-all
                ${isDone ? "bg-green-500 text-white" : "bg-gray-200"}`}
              >
                {step.icon}
              </div>

              <p className="mt-1 text-[11px]">{step.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// main page

const OrderPage = () => {
  const { data: orders, isLoading, isError } = useGetMyOrdersQuery();
  const [canceledOrder] = useCancelOrderMutation();

  // loading
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  // error
  if (isError) {
    return <div className="p-6 text-red-500">Failed to load orders</div>;
  }

  // not found
  if (!orders?.data?.length) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <div className="text-5xl">🛒</div>
        <h2 className="text-xl font-semibold mt-2">No Orders Yet</h2>
        <p className="text-gray-500 text-sm">
          Start shopping to see your orders here
        </p>
      </div>
    );
  }

  const handleCancel = async (id: string) => {
    const toastId = toast.loading("Cancelling order...");
    try {
      await canceledOrder({ id: id }).unwrap();

      toast.update(toastId, {
        render: "Order cancelled successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.data?.message || "Failed to cancel order",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="xl:max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <div className="space-y-5">
        {orders.data.map((order) => (
          <Card key={order._id} className="p-5">
            {/* header */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-semibold text-sm">{order?.orderId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Order Date</p>
                <p className="font-semibold text-sm">{<TimeStamp date={order?.createdAt} />}</p>
              </div>            
            </div>

            {/* TIMELINE */}
            {!order?.isCancel &&  (
              <>
                <OrderTimeline status={order.status} />

                <Separator className="my-4" />
              </>
            )}

            {/* ITEMS */}
            <div className="space-y-4 mt-5">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  {/* IMAGE */}
                  <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={
                        typeof item.product === "object"
                          ? item.product?.images?.[0]?.url || "/placeholder.png"
                          : "/placeholder.png"
                      }
                      alt="product"
                      width={60}
                      height={60}
                      className="object-cover"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex-1">
                    <Link
                      href={
                        typeof item.product === "object"
                          ? `/shop/${item?.product?._id}`
                          : "#"
                      }
                      className="font-medium hover:underline line-clamp-1"
                    >
                      {typeof item.product === "object"
                        ? item?.product?.name
                        : "Unknown Product"}
                    </Link>

                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  {/* PRICE */}
                  <div className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* SHIPPING */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>📍 {order.shippingInfo?.addressOneLine}</p>
              <p>📞 {order.shippingInfo?.contact}</p>
              <p>📧 {order.shippingInfo?.email}</p>
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-4">
              <div>
                <p className="text-sm">
                  Total: <span className="font-medium">${order.total}</span>
                </p>

                <p className="text-sm">
                  Payment:{" "}
                  <span className="font-medium">
                    {order.isCod ? "Cash On Delivery" : "Complete"}
                  </span>
                </p>
              </div>

              {/* CANCEL RULE */}
              {order.status === "pending" && !order.isCancel && (
                <Button
                  onClick={() => handleCancel(order._id)}
                  size="sm"
                  variant="destructive"
                >
                  Cancel Order
                </Button>
              )}

              {order.isCancel && (
                <span className="text-red-500 text-sm font-medium">
                  Cancelled
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderPage;
