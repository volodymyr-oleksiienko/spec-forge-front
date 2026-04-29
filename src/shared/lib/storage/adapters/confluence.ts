import { requestConfluence, view } from '@forge/bridge';
import LZString from 'lz-string';

import type { StorageAdapter } from '../types';

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let previousSaveReject: ((reason?: any) => void) | null = null;

interface PropertyResponse {
  results: Array<{
    id: string;
    key: string;
    value: any;
    version: { number: number };
  }>;
}

export const forgeAdapter: StorageAdapter = {
  getDocumentId: async (): Promise<string> => {
    const context = await view.getContext();
    return context.localId;
  },

  canEdit: async (): Promise<boolean> => {
    try {
      const context = await view.getContext();
      const pageId = context.extension.content.id;
      const accountId = context.accountId;

      if (!pageId || !accountId) {
        return false;
      }

      const response = await requestConfluence(
        `/wiki/rest/api/content/${pageId}/permission/check`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            subject: { type: 'user', identifier: accountId },
            operation: 'update',
          }),
        },
      );

      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      return data.hasPermission === true;
    } catch (e) {
      console.error('Failed to check permissions', e);
      return false;
    }
  },

  load: async (specId) => {
    const context = await view.getContext();
    const pageId = context.extension.content.id;
    const key = `spec-data-${specId}`;

    const res = await requestConfluence(`/wiki/api/v2/pages/${pageId}/properties?key=${key}`);
    const data: PropertyResponse = await res.json();
    const prop = data.results?.[0];

    let serverRaw = null;
    if (prop?.value?.zip) {
      serverRaw = LZString.decompressFromUTF16(prop.value.zip);
    }

    const bufferKey = `spec-buffer-${specId}`;
    const bufferedRaw = localStorage.getItem(bufferKey);

    if (bufferedRaw) {
      if (serverRaw && bufferedRaw === serverRaw) {
        localStorage.removeItem(bufferKey);
      } else {
        if (confirm('Restore unsaved changes?')) {
          return JSON.parse(bufferedRaw);
        } else {
          localStorage.removeItem(bufferKey);
        }
      }
    }

    return serverRaw ? JSON.parse(serverRaw) : null;
  },

  save: async (specId, data) => {
    const bufferKey = `spec-buffer-${specId}`;

    localStorage.setItem(bufferKey, JSON.stringify(data));

    return new Promise((resolve, reject) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        if (previousSaveReject) {
          previousSaveReject('Debounced');
        }
      }

      previousSaveReject = reject;

      debounceTimer = setTimeout(async () => {
        try {
          const context = await view.getContext();
          const pageId = context.extension.content.id;

          const key = `spec-data-${specId}`;

          const zip = LZString.compressToUTF16(JSON.stringify(data));

          const value = { zip };

          const res = await requestConfluence(`/wiki/api/v2/pages/${pageId}/properties?key=${key}`);

          const existing: PropertyResponse = await res.json();

          const prop = existing.results?.[0];

          if (prop) {
            await requestConfluence(`/wiki/api/v2/pages/${pageId}/properties/${prop.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                key,
                value,
                version: { number: prop.version.number + 1 },
              }),
            });
          } else {
            await requestConfluence(`/wiki/api/v2/pages/${pageId}/properties`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                key,
                value,
                version: { number: 1 },
              }),
            });
          }

          localStorage.removeItem(bufferKey);

          resolve();

          previousSaveReject = null;
        } catch (e) {
          reject(e);
          previousSaveReject = null;
        }
      }, 2000);
    });
  },
};
