"use client";

import AddBrand from "@/components/ui/admin/brand/AddBrand";
import DeleteBrandAlert from "@/components/ui/admin/brand/DeleteBrandConfirmModal";
import EditBrandModal from "@/components/ui/admin/brand/EditBrandModal";
import ErrorUi from "@/components/shared/error/ErrorUi";
import LimitSelect from "@/components/shared/limitSelect/LimitSelect";
import { LoadingUi } from "@/components/shared/loadingui/LoadingUi";
import SearchInput from "@/components/shared/searchInput/SearchInput";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useGetBrandsQuery } from "@/redux/features/brand/brandApi";
import { TBrand } from "@/types/user";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const getBrandImageUrl = (brand: TBrand) =>
  typeof brand.img === "string" ? brand.img : brand.img?.url;

const BrandPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useSearchParams();
  const pageNumber = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 15;

  const { data, isLoading, error, isError } = useGetBrandsQuery(
    { page: pageNumber, search: searchQuery, limit },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    },
  );

  const brands = data?.data?.data;
  const meta = data?.data?.meta;

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Brand Management
        </h1>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* LIMIT */}
          <div className="flex-shrink-0">
            <LimitSelect />
          </div>

          {/* SEARCH */}
          <div className="w-full sm:w-[260px] flex-shrink-0">
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search Brand by Name"
            />
          </div>

          {/* ADD BRAND */}
          <div className="flex-shrink-0">
            <AddBrand />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-md border bg-white shadow-sm">
        {isError ? (
          <ErrorUi error={error} />
        ) : (
          <table className="min-w-[760px] w-full text-sm text-left">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Logo</th>
                <th className="p-3">Products</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {brands?.map((brand: TBrand) => (
                <tr
                  key={brand._id}
                  className="hover:bg-gray-50 transition duration-150 border-b"
                >
                  <td className="p-3 font-medium text-gray-800">
                    {brand.name}
                  </td>

                  <td className="p-3 text-gray-600">
                    {getBrandImageUrl(brand) ? (
                      <div className="relative size-12 overflow-hidden rounded border bg-gray-50">
                        <Image
                          src={getBrandImageUrl(brand) as string}
                          alt={brand.name}
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>

                  <td className="p-3 text-gray-600">
                    {brand.productsCount ?? 0}
                  </td>

                  <td className="p-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        brand.isDeleted
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {brand.isDeleted ? "Deleted" : "Active"}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex justify-end">
                      <EditBrandModal brand={brand} />
                      <DeleteBrandAlert brandId={brand._id} />
                    </div>
                  </td>
                </tr>
              ))}

              {!isLoading && brands?.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No brands found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isLoading && <LoadingUi />}

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

export default BrandPage;
