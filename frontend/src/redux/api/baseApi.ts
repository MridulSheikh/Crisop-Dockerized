/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout, setUser, TAuthState } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import {config} from "@/config/config";

interface CustomError {
  errorMessage?: string;
}

type CustomBaseQueryError = FetchBaseQueryError & {
  data?: CustomError;
};

const baseQuery = fetchBaseQuery({
  baseUrl: config.apiUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const { auth } = getState() as { auth: TAuthState };
    const authHeader = "bearer" + " " + auth.token;
    headers.set("authorization", authHeader ? authHeader : "");
    return headers;
  },
});

const baseQueryWithRefreshToken = async (
  args: any,
  api: any,
  extraoptions: any
) => {
  let result = await baseQuery(args, api, extraoptions);
  const error = result.error as CustomBaseQueryError;
  if (
    result.error?.status === 401 &&
    error?.data?.errorMessage === "TokenExpired"
  ) {
    // Send Refresh Token
    const res = await fetch(`${config.apiUrl}/user/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (data?.data?.accessToken) {
      const user = jwtDecode(data.data.accessToken);
      api.dispatch(setUser({ token: data.data.accessToken, user }));
      result = await baseQuery(args, api, extraoptions);
    } else {
      api.dispatch(logout());
    }
  }

  // this error for when user role changed by admin, user can't make any request untile user login again
  if(error?.status === 401 && error.data?.errorMessage === "User login needed!"){
    api.dispatch(logout());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["users", "warehouse", "stocks", "categories", "products", "order", "brands", "message"],
  endpoints: () => ({}),
});
