import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';

import { notifyError } from '../lib/notify';

export const apiErrorHandler: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const headers = (action.meta as any)?.baseQueryMeta?.response?.headers;
    const traceId = headers instanceof Headers ? headers.get('X-Trace-Id') : 'N/A';

    console.error(`[API Error] TraceID: ${traceId}`, {
      endpoint: action.type,
      payload: action.payload,
      traceId,
    });

    const devMessage = ((action.payload as any)?.data || action.payload)?.devMessage;
    notifyError(`Something went wrong: ${devMessage ? devMessage : ''}`);
  }

  return next(action);
};
