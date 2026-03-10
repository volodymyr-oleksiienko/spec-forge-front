import { configureStore } from '@reduxjs/toolkit';

import { api, apiErrorHandler } from '@/shared/api';
import { modalSlice } from '@/shared/modal';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    modal: modalSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiErrorHandler, api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
