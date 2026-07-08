import { baseApi } from "@/redux/api/baseApi";
import { TCategory, TCategoryQueryBuilder } from "@/types/user";



const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getCategory: builder.query<TCategoryQueryBuilder, {[key: string]: string | any }>({
            query: ({page =1, search, limit})=>({
                url: `/category?page=${page}&limit=${limit}${search ? `&searchTerm=${search}`: ""}`,
                 method: 'GET',
            }),
            providesTags: ["categories"]
        }),
        addCategory: builder.mutation({
            query: (body: Omit<TCategory, "_id" | "isDeleted">) => ({
                url: '/category',
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['categories']
        }),
        updateCategories: builder.mutation({
            query: ({id, data} : {id: string, data: {name: string, description?: string }})=>(
                {
                    url: `/category/${id}`,
                    method: "PATCH",
                    body: data
                }
            ),
            invalidatesTags: ['categories']
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/category/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['categories']
        }),
        getSingleCategory: builder.query({
            query: (id)=>({
                url: `/category/${id}`,
                method: 'GET'
            })
        })

    }),
})

export const {useGetCategoryQuery, useAddCategoryMutation, useUpdateCategoriesMutation, useDeleteCategoryMutation, useGetSingleCategoryQuery} = categoryApi;