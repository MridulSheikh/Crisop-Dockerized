"use client";

import AddStock from "@/components/ui/admin/stock/AddStock";
import DeleteStockModal from "@/components/ui/admin/stock/DeleteStockModal";
import UpdateStock from "@/components/ui/admin/stock/UpdateStockModal";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useGetStockQuery } from "@/redux/features/warehouse/stockApi";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import LimitSelect from "@/components/shared/limitSelect/LimitSelect";
import SearchInput from "@/components/shared/searchInput/SearchInput";
import { cn } from "@/lib/utils";
import ErrorUi from "@/components/shared/error/ErrorUi";
import { LoadingUi } from "@/components/shared/loadingui/LoadingUi";

const StockPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  const pageNumber = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 15;

  const { data, isLoading, error, isError } = useGetStockQuery(
    { page: pageNumber, search: searchQuery, limit },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    },
  );

  const stock = data?.data?.data;
  const meta = data?.data?.meta;

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Stock Management
        </h1>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="w-full sm:w-auto">
            <LimitSelect />
          </div>

          <div className="w-full sm:w-[260px] flex-shrink-0">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="🔍 Search Stock by Product"
            />
          </div>

          <div className="flex-shrink-0">
            <AddStock />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-lg border bg-white shadow-sm">
        {isError ? (
          <ErrorUi error={error} />
        ) : (
          <table className="min-w-[800px] w-full text-sm text-left">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Warehouse</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {stock?.map((item: any) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium text-gray-800">
                    {item.productName}
                  </td>

                  <td className="p-3 text-gray-600">{item.sku}</td>

                  <td className="p-3 text-gray-600">
                    <span
                      className={cn("text-green-600 font-medium", {
                        "text-red-500": item.quantity < 10,
                      })}
                    >
                      {item.quantity}
                    </span>{" "}
                    {item.unit}
                  </td>

                  <td className="p-3 text-gray-600">{item.warehouse?.name}</td>

                  {/* FIXED ACTIONS COLUMN */}
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <UpdateStock stock={item} />
                      <DeleteStockModal stockId={item._id} />
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && stock?.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No stock found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="mt-4">
          <LoadingUi />
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
};

export default StockPage;
