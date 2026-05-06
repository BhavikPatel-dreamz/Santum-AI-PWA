import { configureStore } from "@reduxjs/toolkit";
import { appApi } from "./apis/app";
import pushReducer from "./pushSlice";

export const store = configureStore({
  reducer: {
    [appApi.reducerPath]: appApi.reducer,
    push:pushReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(appApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from "./apis";
export * from "./hooks";
