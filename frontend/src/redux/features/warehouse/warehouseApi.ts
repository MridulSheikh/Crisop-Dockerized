import { baseApi } from "@/redux/api/baseApi";
import { TWareHouseBuilderQueries } from "@/types/user";

const wareHouseApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getWarehouse: builder.query<TWareHouseBuilderQueries, { [key: string]: string | any }>({
            query: ({ page = 1, search, limit }) => ({
                url: `/warehouse?page=${page}&limit=${limit}${search ? `&searchTerm=${search}` : ""}`,
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.data.map((wh) => ({
                            type: "warehouse" as const,
                            id: wh._id,
                        })),
                        { type: "warehouse", id: "LIST" },
                    ]
                    : [{ type: "warehouse", id: "LIST" }],
        }),
        addWareHouse: builder.mutation({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query: (body: any) => ({
                url: `/warehouse`,
                method: 'POST',
                body: body,
            }),
            invalidatesTags: [{ type: "warehouse", id: "LIST" }]
        }),
        updateWareHouse: builder.mutation({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query: ({ id, data }: { id: string, data: any }) => ({
                url: `/warehouse/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: [{ type: "warehouse", id: "LIST" }]
        }),
        deleteWareHouse: builder.mutation({
            query: (id) => ({
                url: `/warehouse/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: "warehouse", id: "LIST" }]
        })
    })
})

export const { useAddWareHouseMutation, useGetWarehouseQuery, useUpdateWareHouseMutation, useDeleteWareHouseMutation } = wareHouseApi;