import { configureStore } from "@reduxjs/toolkit";

// Reserved for future use (e.g. auth state, notifications, cross-feature state)
export const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
