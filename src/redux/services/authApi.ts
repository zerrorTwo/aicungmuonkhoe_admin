import { baseApi } from "../baseApi";
import type { ApiResponse, LoginDto, AuthResponse } from "@/types/api.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthResponse>, LoginDto>({
      query: (credentials) => ({
        url: "../auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
