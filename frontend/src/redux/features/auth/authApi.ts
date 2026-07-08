import { baseApi } from "../../api/baseApi";

type TResponseUser = {
   data: {
    accessToken: string,
   },
   message: string,
   statusCode: number,
   status: boolean
};

type ToAuthLoginPayload = {
   accessToken: string,
   method: string
};

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signupUser: builder.mutation({
      query: (data) => ({
        url: "/user/create",
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/user/login",
        method: "POST",
        body: data,
      }),
    }),
    OauthLogin: builder.mutation<TResponseUser, ToAuthLoginPayload>({
      query: (data) => ({
        url: "/user/oauth",
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/user/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/user/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    verfiyEmail: builder.mutation({
      query: (data) => ({
        url: `/user/verify`,
        method: "POST",
        body: data
      })
    }),
    logOutMe:builder.mutation({
      query:()=>({
        url:'/user/logout-me',
        method: "POST",
      })
    })
  }),
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useOauthLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation, 
  useVerfiyEmailMutation,
  useLogOutMeMutation
} = authApi;