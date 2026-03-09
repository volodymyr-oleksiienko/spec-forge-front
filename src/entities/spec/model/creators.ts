import type { SpecRow } from './types.ts';

export const buildEmptyRow = (depth: number): SpecRow => {
  return {
    id: crypto.randomUUID(),
    depth,
    name: '',
    type: { type: 'STRING' },
    required: true,
    description: '',
    deprecated: false,
  };
};
