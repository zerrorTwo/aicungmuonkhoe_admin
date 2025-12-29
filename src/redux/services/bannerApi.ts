import { baseApi } from "../baseApi";
import type {
  ApiResponse,
  Banner,
  BannerQuery,
  PaginatedBannerResult,
} from "@/types/api.types";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all banners with pagination and filters
    getBanners: builder.query<PaginatedBannerResult, BannerQuery>({
      query: (params) => ({
        url: "/admin/banners",
        params,
      }),
      providesTags: ["Banner"],
    }),

    // Get a single banner by ID
    getBanner: builder.query<ApiResponse<Banner>, number>({
      query: (id) => `/admin/banners/${id}`,
      providesTags: (result, error, id) => [{ type: "Banner", id }],
    }),

    // Create a new banner using FormData for file upload
    createBanner: builder.mutation<ApiResponse<Banner>, FormData>({
      query: (formData) => ({
        url: "/admin/banners",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Banner"],
    }),

    // Update an existing banner using FormData
    updateBanner: builder.mutation<
      ApiResponse<Banner>,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/admin/banners/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Banner", id },
        "Banner",
      ],
    }),

    // Delete a banner
    deleteBanner: builder.mutation<ApiResponse<boolean>, number>({
      query: (id) => ({
        url: `/admin/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banner"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetBannersQuery,
  useGetBannerQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
