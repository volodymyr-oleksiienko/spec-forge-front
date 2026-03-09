import type { JavaConfig, TypeScriptConfig } from './types.ts';

export const DEFAULT_JAVA: JavaConfig = {
  language: 'JAVA',
  base: { naming: { className: 'RootDto' }, fields: { sort: 'REQUIRED_FIRST' } },
  structure: { type: 'RECORD' },
  validation: { enabled: true },
  builder: { enabled: true, onlyIfMultipleFields: false },
  serialization: { jsonPropertyMode: 'ALWAYS' },
};

export const DEFAULT_TS: TypeScriptConfig = {
  language: 'TYPESCRIPT',
  base: { naming: { className: 'RootDto' }, fields: { sort: 'REQUIRED_FIRST' } },
  structure: { style: 'INTERFACE' },
  enums: { style: 'UNION_STRING' },
};
