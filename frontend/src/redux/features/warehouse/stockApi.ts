import {baseApi} from "@/redux/api/baseApi";
import { TStock, TStockBuilderQueries } from "@/types/user";

const stockApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getStock: builder.query<TStockBuilderQueries, {[key: string]: string | any}>({
            query: ({page = 1, search, limit})=> ({
                url: `/stock?page=${page}&limit=${limit}${search ? `&searchTerm=${search}`: ""}`,
                method: 'GET',
            }),
            providesTags: ["stocks"]
        }),
        addStocks: builder.mutation({
            query: (body: Omit<TStock, "_id" | "sku" | "isDeleted">) =>({
                url: '/stock',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['stocks']
        }),
        updateStocks: builder.mutation({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            query: ({id, data} : {id: string, data: any}) => ({
                url: `/stock/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ['stocks']
        }),
        deleteStocks: builder.mutation({
            query: (id) => ({
                url: `/stock/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['stocks']
        }),
        getSingleStock: builder.query({
            query: (id)=>({
                url: `/stock/${id}`,
                method: 'GET'
            })
        })
    })
})


export const {useGetStockQuery, useAddStocksMutation, useDeleteStocksMutation, useUpdateStocksMutation, useGetSingleStockQuery} = stockApi;