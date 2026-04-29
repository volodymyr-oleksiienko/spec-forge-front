import { standaloneAdapter } from './adapters/standalone';
import type { StorageAdapter } from './types';

export const isEmbedded = import.meta.env.VITE_APP_BUILD_TARGET === 'forge';

export const storage: StorageAdapter = isEmbedded
  ? (await import('./adapters/confluence.ts')).forgeAdapter
  : standaloneAdapter;
