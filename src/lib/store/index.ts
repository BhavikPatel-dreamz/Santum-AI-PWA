import { configureStore } from '@reduxjs/toolkit';
import { postsApi } from './apis/posts';
import { usersApi } from './apis/users';

export const store = configureStore({
  reducer: {
    [postsApi.reducerPath]: postsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(postsApi.middleware)
      .concat(usersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from './apis';
export * from './hooks';