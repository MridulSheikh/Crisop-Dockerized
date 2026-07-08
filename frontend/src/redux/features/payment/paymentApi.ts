import { baseApi } from "@/redux/api/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<
      { data: {clientSecret: string } },
      {
        items: {
          name: string;
          price: number;
          quantity: number;
        }[]
      }
    >({
      query: (data) => ({
        url: "/payment/create-stripe-intent",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentApi;