"use client";

import { useState } from "react";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useSearchParams } from "next/navigation";
import SearchInput from "@/components/shared/searchInput/SearchInput";
import LimitSelect from "@/components/shared/limitSelect/LimitSelect";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { useGetAdminProductQuery } from "@/redux/features/product/productApi";
import ErrorUi from "@/components/shared/error/ErrorUi";
import { hasPermission } from "@/helper/auth";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentUser } from "@/redux/features/auth/authSlice";

export default function ProductPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const user = useAppSelector(useCurrentUser);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 15;

  const { data, isLoading, isError, error } = useGetAdminProductQuery({
    page,
    limit,
    search: searchQuery,
  });

  const products = data?.data;
  const meta = data?.meta;

  if (
    !hasPermission(user?.role as "admin" | "manager" | "super", "view:products")
  ) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Product Management
        </h1>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Limit Select */}
          <div className="flex-shrink-0">
            <LimitSelect />
          </div>

          {/* Search */}
          <div className="w-full sm:w-[260px] flex-shrink-0">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="🔍 Search Product"
            />
          </div>

          {/* Add Button */}
          {hasPermission(
            user?.role as "admin" | "manager" | "super",
            "create:products",
          ) && (
            <Link
              href="/admin/add-product"
              className="w-full sm:w-auto flex-shrink-0"
            >
              <Button className="w-full sm:w-auto">Add Product</Button>
            </Link>
          )}
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="w-full overflow-x-auto rounded-md border bg-white shadow-sm">
        {isError ? (
          <ErrorUi error={error} />
        ) : (
          <table className="min-w-[800px] w-full text-sm text-left">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products?.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}

              {!isLoading && products?.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="mt-4 text-center text-gray-500">
          Loading products...
        </div>
      )}

      {/* PAGINATION */}
      {!isLoading && meta && (
        <div className="mt-6 flex justify-center sm:justify-end">
          <PaginationWithLinks
            page={meta.page}
            pageSize={meta.limit}
            totalCount={meta.total}
          />
        </div>
      )}
    </div>
  );
}
