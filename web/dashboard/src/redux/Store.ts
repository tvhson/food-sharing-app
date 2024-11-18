import { configureStore } from "@reduxjs/toolkit";
import TokenReducer from "./TokenReducer";

export const Store = configureStore({
  reducer: {
    token: TokenReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof Store.getState>;
