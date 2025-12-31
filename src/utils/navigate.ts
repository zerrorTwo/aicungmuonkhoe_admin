export const PageURLs = {
  ofFoodManagement: () => "/food-v1",
  ofDishManagement: () => "/dish",
  ofDishManagementCreate: () => "/dish/create", // Using query param mode=FALSE for create in same form usually, but let's follow food pattern if it has separate routes or just query params. Food uses ?mode=X. So base is sufficient.
};
