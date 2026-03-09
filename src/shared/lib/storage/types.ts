export type Mode = 'init' | 'edit';

export interface StorageAdapter {
  init: (id: string) => Promise<void>;
  getMode: () => Mode;
  getDocumentId: () => Promise<string>;
  canEdit: () => Promise<boolean>;
  load: (id: string) => Promise<any | null>;
  save: (id: string, data: any) => Promise<void>;
}
