"use client";

import AddWarehouse from "@/components/ui/admin/warehouse/AddWarehouse";
import DeleteWarehouseModal from "@/components/ui/admin/warehouse/DeleteWarehouseModal";
import EditWarehouse from "@/components/ui/admin/warehouse/EditWarehouseModal";
import { useGetWarehouseQuery } from "@/redux/features/warehouse/warehouseApi";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import LimitSelect from "@/components/shared/limitSelect/LimitSelect";
import SearchInput from "@/components/shared/searchInput/SearchInput";
import ErrorUi from "@/components/shared/error/ErrorUi";
import { LoadingUi } from "@/components/shared/loadingui/LoadingUi";

export default function WarehousePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  const pageNumber = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 15;

  const { data, isLoading, error, isError } = useGetWarehouseQuery(
    { page: pageNumber, search: searchQuery, limit },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    },
  );

  const warehouses = data?.data?.data;
  const meta = data?.data?.meta;

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Warehouses
        </h1>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex-shrink-0">
            <LimitSelect />
          </div>

          <div className="w-full sm:w-[260px] flex-shrink-0">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="🔍 Search warehouse"
            />
          </div>

          <div className="flex-shrink-0">
            <AddWarehouse />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-lg border bg-white shadow-sm">
        {isError ? (
          <ErrorUi error={error} />
        ) : (
          <table className="min-w-[700px] w-full text-sm text-left">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Location</th>
                <th className="p-3">Capacity</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {warehouses?.map((wh: any) => (
                <tr
                  key={wh._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium text-gray-800">{wh.name}</td>

                  <td className="p-3 text-gray-600">{wh.location}</td>

                  <td className="p-3 text-gray-600">{wh.capacity}</td>

                  {/* ACTIONS FIXED */}
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <EditWarehouse initialData={wh} />
                      <DeleteWarehouseModal id={wh._id} />
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && warehouses?.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    No warehouses found.
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
}
