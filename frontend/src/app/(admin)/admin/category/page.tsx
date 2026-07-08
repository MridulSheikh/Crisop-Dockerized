"use client";

import AddCategory from "@/components/ui/admin/category/AddCategory";
import EditCategoryModal from "@/components/ui/admin/category/EditeCategoryModal";
import DeleteCategoryAlert from "@/components/ui/admin/category/DeleteCategoryConfirmModal";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import LimitSelect from "@/components/shared/limitSelect/LimitSelect";
import SearchInput from "@/components/shared/searchInput/SearchInput";
import { TCategory } from "@/types/user";
import { useGetCategoryQuery } from "@/redux/features/category/categoryApi";
import ErrorUi from "@/components/shared/error/ErrorUi";
import { LoadingUi } from "@/components/shared/loadingui/LoadingUi";

const CategoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const pageNumber = Number(page) || 1;
  const limit = Number(searchParams.get("limit")) || 15;
  const { data, isLoading, error, isError } = useGetCategoryQuery(
    { page: pageNumber, search: searchQuery, limit },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    },
  );

  const categories = data?.data?.data;
  const meta = data?.data?.meta;

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Category Management
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
              placeholder="🔍 Search Category by Name"
            />
          </div>

          {/* ADD CATEGORY */}
          <div className="flex-shrink-0">
            <AddCategory />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isError ? (
          <div className="bg-white">
            <ErrorUi error={error} />
          </div>
        ) : (
          <table className="min-w-full shadow-md bg-white rounded-md overflow-hidden text-left text-sm">
            <thead className="bg-black text-white text-left">
              <tr>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Description</th>
                <th className="p-3 border-b">Products</th>
                <th className="p-3 border-b flex justify-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories?.map((category: TCategory) => (
                <tr
                  key={category._id}
                  className="hover:bg-gray-50 transition duration-150 border-b"
                >
                  <td className="p-3 font-medium text-gray-800">
                    {category.name}
                  </td>

                  <td className="p-3 text-gray-600">{category.description}</td>

                  <td className="p-3 text-gray-600">
                    {category.productsCount}
                  </td>

                  <td className="flex justify-end">
                    <EditCategoryModal category={category} />
                    <DeleteCategoryAlert categoryId={category._id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isLoading && <LoadingUi />}
      </div>

      {/* Pagination */}
      {!isLoading && (
        <div className="mt-5">
          <PaginationWithLinks
            page={meta?.page as number}
            pageSize={meta?.limit as number}
            totalCount={meta?.total as number}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
