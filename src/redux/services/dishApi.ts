import { baseApi } from "@/redux/baseApi";
import { Dish, DishFilter, DishResponse } from "@/types/dish";

export const dishApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDishes: builder.query<DishResponse, DishFilter>({
      query: (params) => ({
        url: "dish", // Assuming BE endpoint is 'dish' or 'dishes'. Based on Controller naming often plural or singular. Checking entity: @Entity('dish'). Often route is plural. Let's start with 'dish' as user asked to rename food->dish.
        method: "GET",
        params,
      }),
      providesTags: ["Dish"],
    }),
    getDishById: builder.query<Dish, string>({
      query: (id) => `dish/${id}`,
    }),
    createDish: builder.mutation<Dish, FormData>({
      query: (body) => ({
        url: "dish",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Dish"],
    }),
    updateDish: builder.mutation<Dish, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `dish/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Dish"],
    }),
    deleteDish: builder.mutation<void, string>({
      query: (id) => ({
        url: `dish/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Dish"],
    }),
    getDishAges: builder.query<any, void>({
      query: () => "dish/ages", // Assumed endpoint
    }),
    getDishRegions: builder.query<any, void>({
      query: () => "dish/regions", // Assumed endpoint
    }),
    getDishCookingMethods: builder.query<any, void>({
      query: () => "dish/cooking-methods", // Assumed endpoint
    }),
    getDishMealStructures: builder.query<any, void>({
      query: () => "dish/meal-structures", // Assumed endpoint
    }),
  }),
});

export const {
  useGetDishesQuery,
  useGetDishByIdQuery,
  useCreateDishMutation,
  useUpdateDishMutation,
  useDeleteDishMutation,
  useGetDishAgesQuery,
  useGetDishRegionsQuery,
  useGetDishCookingMethodsQuery,
  useGetDishMealStructuresQuery,
} = dishApi;
