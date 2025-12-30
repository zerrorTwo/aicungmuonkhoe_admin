import { baseApi } from "@/redux/baseApi";

export const foodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFoods: builder.query<any, any>({
      query: (params) => ({
        url: "foods",
        method: "GET",
        params,
      }),
      providesTags: ["Food"],
    }),
    getFoodById: builder.query<any, number | string>({
      query: (id) => `foods/${id}`,
    }),
    createFood: builder.mutation<any, any>({
      query: (body) => ({
        url: "foods",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Food"],
    }),
    updateFood: builder.mutation<any, { id: number | string; data: any }>({
      query: ({ id, data }) => ({
        url: `foods/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Food"],
    }),
    deleteFood: builder.mutation<any, number | string>({
      query: (id) => ({
        url: `foods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Food"],
    }),
    getFoodGroups: builder.query<any, void>({
      query: () => "foods/groups",
    }),
    getFoodClassifications: builder.query<any, void>({
      query: () => "foods/classifications",
    }),
    importFood: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "foods/import",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Food"],
    }),
    getMaterialGroups: builder.query<any, void>({
      query: () => "material-groups",
    }),
  }),
});

export const {
  useGetFoodsQuery,
  useGetFoodByIdQuery,
  useCreateFoodMutation,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
  useGetFoodGroupsQuery,
  useGetFoodClassificationsQuery,
  useImportFoodMutation,
  useGetMaterialGroupsQuery,
} = foodApi;
