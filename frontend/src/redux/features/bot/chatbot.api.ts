import { baseApi } from "@/redux/api/baseApi";

export type SendMessageRequest = {
  prompt: string;
};

export const chatBotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (body: SendMessageRequest) => {
        return {
          url: "/chat/v2",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["message"],
    }),

    getAllMessage: builder.query({
      query: () => ({
        url: "/chat/v2",
        method: "GET",
      }),
      providesTags: ["message"]
    }),  
  }),
  overrideExisting: false,
});

export const { useSendMessageMutation, useGetAllMessageQuery } = chatBotApi;
