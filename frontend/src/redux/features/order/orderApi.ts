import { baseApi } from "@/redux/api/baseApi";
import { TProduct } from "@/types/user";

// types

export type TOrderItem<P> = {
  id?: string;
  product: P;
  quantity: number;
  price: number;
  discountPrice?: number;
};

export type TOrder<P> = {
  orderId?: string;
  _id: string;
  customer: string;
  shippingInfo: {
    addressOneLine: string;
    type: "Standard" | "24h" | "3d";
    contact: string;
    email: string;
    division: string;
  };
  items: TOrderItem<P>[];
  status: "pending" | "packing" | "shipped" | "delivered";
  isCancel: boolean;
  isCod: boolean;
  isPaymentComplete: boolean;
  createdAt: string;
  total: number;
};

export type TGetOrderQuery<T> = {
  data: T;
};
export type TGetAllOrder = {
  data: {
    items: TOrder<TProduct>[];
    meta: {
      limit: number;
      page: number;
      total: number;
      totalPage: number;
    };
    message: string;
    statusCode: number;
    success: boolean;
  };
};
// Api

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // REATE ORDER
    postOrderUser: builder.mutation<
      { success: boolean; data: TOrder<string> },
      Partial<TOrder<string>>
    >({
      query: (data) => ({
        url: "/order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["order"],
    }),

    // GET MY ORDERS
    getMyOrders: builder.query<TGetOrderQuery<TOrder<TProduct>[]>, void>({
      query: () => ({
        url: `/order/my-orders`,
        method: "GET",
      }),
      providesTags: ["order"],
    }),

    // GET SINGLE ORDER
    getSingleOrder: builder.query<{ data: TOrder<TProduct> }, string>({
      query: (id) => ({
        url: `/order/${id}`,
        method: "GET",
      }),
      providesTags: ["order"],
    }),

    // UPDATE ORDER STATUS (ADMIN)
    updateOrderStatus: builder.mutation<
      { success: boolean },
      { id: string; status: TOrder<string>["status"] }
    >({
      query: ({ id, status }) => ({
        url: `/order/toggle/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["order"],
    }),

    // CANCEL ORDER
    cancelOrder: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `/order/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["order"],
    }),
    // GET ALL ORDER
    getAllOrders: builder.query<
      TGetAllOrder,
      { page?: number; search?: string; limit?: number; status?: string }
    >({
      query: ({ status, page = 1, search = "", limit = 10 }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (status) {
          params.append("status", status.toString());
        }
        if (search) params.append("searchTerm", search);
        return {
          url: `/order?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["order"],
    }),
  }),

  overrideExisting: true,
});

export const {
  usePostOrderUserMutation,
  useGetMyOrdersQuery,
  useGetSingleOrderQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useGetAllOrdersQuery,
} = orderApi;
