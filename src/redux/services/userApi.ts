import { baseApi } from "../baseApi";
import type {
  User,
  UserQuery,
  UpdateUserDto,
  ApiResponse,
  PaginatedResult,
  UserStats,
} from "@/types/api.types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with pagination and filters
    getUsers: builder.query<ApiResponse<PaginatedResult<User>>, UserQuery>({
      query: (params) => ({
        url: "/users",
        params,
      }),
      providesTags: ["User"],
    }),

    // Get user stats
    getUserStats: builder.query<ApiResponse<UserStats>, void>({
      query: () => "/users/stats/overview",
      providesTags: ["User"],
    }),

    // Get a single user by ID
    getUser: builder.query<ApiResponse<User>, number>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Update an existing user
    updateUser: builder.mutation<
      ApiResponse<void>,
      { id: number; data: UpdateUserDto }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        "User",
      ],
    }),

    // Delete a user
    deleteUser: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetUsersQuery,
  useGetUserStatsQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
