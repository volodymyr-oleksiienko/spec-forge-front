import { DEFAULT_JAVA, DEFAULT_TS, type GenerationConfig } from '@/entities/config';

export const CONFIG_PRESETS: Record<string, GenerationConfig> = {
  'Java Modern': DEFAULT_JAVA,
  'Java Classic': { ...DEFAULT_JAVA, structure: { type: 'CLASS' } },
  'TS Interface': DEFAULT_TS,
  'TS Type Alias': { ...DEFAULT_TS, structure: { style: 'TYPE_ALIAS' } },
};
