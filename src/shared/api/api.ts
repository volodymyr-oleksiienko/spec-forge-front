import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { isEmbedded } from '@/shared/lib/storage';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: isEmbedded
      ? import.meta.env.VITE_APP_API_REMOTE_BASE + import.meta.env.VITE_APP_API_PREFIX
      : import.meta.env.VITE_APP_API_PREFIX,
  }),
  endpoints: () => ({}),
});
