import type { Mode, StorageAdapter } from '../types.ts';

export const standaloneAdapter: StorageAdapter = {
  getMode: (): Mode => 'edit',

  getDocumentId: async (): Promise<string> => {
    let id = localStorage.getItem('spec-id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('spec-id', id);
    }
    return id;
  },

  canEdit: async () => true,

  init: async () => {},

  load: async (): Promise<any | null> => {
    const raw = localStorage.getItem('spec-data');
    return raw ? JSON.parse(raw) : null;
  },

  save: async (_id: string, data: any): Promise<void> => {
    localStorage.setItem('spec-data', JSON.stringify(data));
  },
};
