// frontend/src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import typingReducer from './slices/typingSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    typing: typingReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;