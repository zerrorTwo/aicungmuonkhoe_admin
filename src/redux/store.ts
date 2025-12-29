import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    // Add the RTK Query API reducer
    [baseApi.reducerPath]: baseApi.reducer,
    // Other slices will be added here
    auth: authReducer,
  },
  // Add the RTK Query middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
