import { standaloneAdapter } from './adapters/standalone';
import type { StorageAdapter } from './types';

export const storage: StorageAdapter = standaloneAdapter;
