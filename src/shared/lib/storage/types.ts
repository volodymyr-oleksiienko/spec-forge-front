export interface StorageAdapter {
  getDocumentId: () => Promise<string>;
  canEdit: () => Promise<boolean>;
  load: (id: string) => Promise<any | null>;
  save: (id: string, data: any) => Promise<void>;
}
