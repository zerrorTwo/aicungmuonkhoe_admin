export type Dish = {
  ID: string;
  AGE_GROUP_ID: string;
  NAME: string;
  REGION_ID?: string;
  COOKING_METHOD_ID?: string;
  MEAL_STRUCTURE_ID?: string;
  SMALL_IMAGE?: string;
  EXTERNAL_DISH_TYPE_ID?: string;
  LARGE_IMAGE?: string;
  COOKING_INSTRUCTION?: string;
  TIPS?: string;
  ADDITIONAL_INFO?: string;
  STATUS?: number;
  CREATED_BY?: string;
  CREATED_AT?: string;
  UPDATED_BY?: string;
  UPDATED_AT?: string;
};

export type DishFilter = {
  name?: string;
  page?: number;
  limit?: number;
  // Add other filters as needed matching Food's pattern
};

export type DishResponse = {
  data: Dish[];
  total: number;
  currentPage: number;
  totalPages: number;
};
