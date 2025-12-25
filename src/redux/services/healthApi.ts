import { baseApi } from "../baseApi";
import type {
  ConclusionRecommendation,
  CreateConclusionRecommendationDto,
  UpdateConclusionRecommendationDto,
  ApiResponse,
} from "@/types/api.types";
import { keyToModel } from "@/utils/conclusion-key-mapper";

export const healthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all conclusion recommendations by key
    getConclusionRecommendations: builder.query<
      ApiResponse<ConclusionRecommendation[]>,
      string
    >({
      query: (key) => {
        // Map frontend key to backend model name
        const model = keyToModel(key);
        return `/conclusion-recommendations?model=${model}`;
      },
      providesTags: (result, error, key) => [
        { type: "ConclusionRecommendation", id: key },
      ],
    }),

    // Get a single conclusion recommendation by ID
    getConclusionRecommendation: builder.query<
      ApiResponse<ConclusionRecommendation>,
      number
    >({
      query: (id) => `/conclusion-recommendations/${id}`,
      providesTags: (result, error, id) => [
        { type: "ConclusionRecommendation", id },
      ],
    }),

    // Create a new conclusion recommendation
    createConclusionRecommendation: builder.mutation<
      ApiResponse<ConclusionRecommendation>,
      CreateConclusionRecommendationDto
    >({
      query: (body) => ({
        url: "/conclusion-recommendations",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "ConclusionRecommendation", id: arg.key },
      ],
    }),

    // Update an existing conclusion recommendation
    updateConclusionRecommendation: builder.mutation<
      ApiResponse<ConclusionRecommendation>,
      { id: number; data: UpdateConclusionRecommendationDto }
    >({
      query: ({ id, data }) => ({
        url: `/conclusion-recommendations/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ConclusionRecommendation", id },
      ],
    }),

    // Delete a conclusion recommendation
    deleteConclusionRecommendation: builder.mutation<ApiResponse<void>, number>(
      {
        query: (id) => ({
          url: `/conclusion-recommendations/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "ConclusionRecommendation", id },
        ],
      }
    ),

    // Bulk update conclusion recommendations
    bulkUpdateConclusionRecommendations: builder.mutation<
      ApiResponse<void>,
      any
    >({
      query: (body) => ({
        url: "/conclusion-recommendations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ConclusionRecommendation"],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetConclusionRecommendationsQuery,
  useGetConclusionRecommendationQuery,
  useCreateConclusionRecommendationMutation,
  useUpdateConclusionRecommendationMutation,
  useDeleteConclusionRecommendationMutation,
  useBulkUpdateConclusionRecommendationsMutation,
} = healthApi;
