import { baseApi } from "@/redux/api/baseApi";
import { TProductBuilderQueries } from "@/types/user";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET PRODUCTS
    getAdminProduct: builder.query<
      TProductBuilderQueries,
      { page?: number; search?: string; limit?: number }
    >({
      query: ({ page = 1, search = "", limit = 10 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("searchTerm", search);

        return {
          url: `/product/admin?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["products"],
    }),

    getProduct: builder.query<
      TProductBuilderQueries,
      { page?: number; search?: string; limit?: number }
    >({
      query: ({ page = 1, search = "", limit = 10 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("searchTerm", search);

        return {
          url: `/product?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["products"],
    }),

    // CREATE PRODUCT (MUTATION)
    createProduct: builder.mutation({
      query: (data: FormData) => {
        return {
          url: "/product",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["products"], // auto refetch list
    }),

    // DELETE PRODUCT (MUTATION)
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),

    // UPDATE PRODUCT MUTATION
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/product/${id}`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["products"],
    }),
    // GET SINGLE PRODUCT
    getSingleProduct: builder.query({
      query: (id: string) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      providesTags: ["products"],
    }),
  }),
});

export const {
  useGetAdminProductQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetSingleProductQuery,
} = productApi;
