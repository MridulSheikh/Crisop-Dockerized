import { baseApi } from "@/redux/api/baseApi";
import { TBrand, TBrandQueryBuilder } from "@/types/user";

type TBrandQueryParams = {
  page?: number;
  search?: string;
  limit?: number;
};

const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<TBrandQueryBuilder, TBrandQueryParams | void>({
      query: (args) => {
        const { page = 1, search = "", limit = 10 } = args ?? {};
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("searchTerm", search);

        return {
          url: `/brand?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["brands"],
    }),

    getSingleBrand: builder.query<TBrand, string>({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "GET",
      }),
      providesTags: ["brands"],
    }),

    createBrand: builder.mutation<TBrand, FormData>({
      query: (body) => ({
        url: "/brand",
        method: "POST",
        body,
      }),
      invalidatesTags: ["brands"],
    }),

    updateBrand: builder.mutation<
      TBrand,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/brand/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["brands"],
    }),

    softDeleteBrand: builder.mutation<TBrand, string>({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["brands"],
    }),

    hardDeleteBrand: builder.mutation<TBrand, string>({
      query: (id) => ({
        url: `/brand/${id}/hard`,
        method: "DELETE",
      }),
      invalidatesTags: ["brands"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetSingleBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useSoftDeleteBrandMutation,
  useHardDeleteBrandMutation,
} = brandApi;
