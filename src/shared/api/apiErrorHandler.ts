import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';

import { notifyError } from '@/shared/lib';

export const apiErrorHandler: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const headers = (action.meta as any)?.baseQueryMeta?.response?.headers;
    const traceId = headers instanceof Headers ? headers.get('X-Trace-Id') : 'N/A';

    console.error(`[API Error] TraceID: ${traceId}`, {
      endpoint: action.type,
      payload: action.payload,
      traceId,
    });

    notifyError(
      'Something went wrong. Please refresh the page and try again. Notify developers if it keeps happening.',
    );
  }

  return next(action);
};
