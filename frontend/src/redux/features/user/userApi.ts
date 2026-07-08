import { baseApi } from "@/redux/api/baseApi";
import { TUserBuilderQueries } from "@/types/user";

interface GetTeamMemberParams {
    page?: number;
    role?: string;
    // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
    search?: String;
    limit?:number;
}

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getTeamMember: builder.query<TUserBuilderQueries, GetTeamMemberParams>({
            query: ({ role = "admin,manager,super", page = 1, search, limit }) => ({
                url: `/user?page=${page}&limit=${limit}&role=${encodeURIComponent(role)}${search ? `&searchTerm=${search}`: ""}`,
                method: "GET",
            }),
            providesTags: ["users"],
        }),
        addTeamMemeber: builder.mutation({
            query: (data) => ({
                url: "/user/add-member",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["users"]
        }),
        changeUserRole: builder.mutation({
            query: (data) => ({
                url: "/user/change-role",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["users"]
        }),
        updateMyProfile: builder.mutation({
            query: (data) => ({
                url: "/user/me",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["users"],
        }),
        changeMyPassword: builder.mutation({
            query: (data) => ({
                url: "/user/change-password",
                method: "PATCH",
                body: data,
            }),
        }),
    })
})


export const {
    useGetTeamMemberQuery,
    useAddTeamMemeberMutation,
    useChangeUserRoleMutation,
    useUpdateMyProfileMutation,
    useChangeMyPasswordMutation,
} = userApi
