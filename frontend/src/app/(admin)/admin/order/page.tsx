"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetAllOrdersQuery, TOrder } from "@/redux/features/order/orderApi";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import LimitSelect from "@/components/shared/limitSelect/LimitSelect";
import SearchInput from "@/components/shared/searchInput/SearchInput";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LoadingUi } from "@/components/shared/loadingui/LoadingUi";
import { hasPermission } from "@/helper/auth";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentUser } from "@/redux/features/auth/authSlice";

const STATUS_OPTIONS = ["all", "pending", "packing", "shipped", "delivered"];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "packing":
      return "bg-blue-100 text-blue-700";
    case "shipped":
      return "bg-purple-100 text-purple-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const OrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const status = searchParams.get("status") || "all";
  const user = useAppSelector(useCurrentUser);

  // API CALL
  const { data, isLoading, isError } = useGetAllOrdersQuery({
    page,
    limit,
    search: searchQuery,
    status: status === "all" ? undefined : status,
  });

  const orders = data?.data?.items || [];
  const meta = data?.data?.meta;

  // STATUS CHANGE HANDLER
  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load orders
      </div>
    );
  }

  if (
    !hasPermission(
      user?.role as "admin" | "manager" | "super",
      "update:products",
    )
  ) {
    return null;
  }

  return (
    <div className="p-6 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">All Orders</h1>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* STATUS FILTER */}
          <div className="flex-shrink-0">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="packing">Packing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* LIMIT */}
          <div className="flex-shrink-0">
            <LimitSelect />
          </div>

          {/* SEARCH */}
          <div className="w-full sm:w-[260px] flex-shrink-0">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="🔍 Search order"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          {/* HEAD */}
          <thead className="bg-black text-white text-sm">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {orders.map((order: TOrder<any>) => (
              <tr key={order._id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">
                  {order.orderId || order._id.slice(0, 8)}
                </td>

                <td className="p-4">{order.customer || "Unknown"}</td>

                <td className="p-4 font-semibold">${order.total}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="p-4">
                  {order.isPaymentComplete ? (
                    <span className="text-green-600 text-sm">Paid</span>
                  ) : (
                    <span className="text-red-500 text-sm">Unpaid</span>
                  )}
                </td>

                <td className="p-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4 text-right">
                  <Link
                    href={`/admin/order/${order._id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {!isLoading && orders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* LOADING */}
      {isLoading && <LoadingUi />}

      {/* PAGINATION */}
      {!isLoading && meta && (
        <div className="mt-5">
          <PaginationWithLinks
            page={meta.page}
            pageSize={meta.limit}
            totalCount={meta.total}
          />
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
