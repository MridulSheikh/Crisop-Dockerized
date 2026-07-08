import { baseApi } from "@/redux/api/baseApi";

export type SendMessageRequest = {
  message: string;
  inboxId?: string;
};

export const chatBotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    sendMessage: builder.mutation({
      query: (body: SendMessageRequest) => {
        return {
          url: "/chat",
          method: "POST",
          body,
        };
      },
    }),

  }),
  overrideExisting: false,
});

export const {
  useSendMessageMutation,
} = chatBotApi;
