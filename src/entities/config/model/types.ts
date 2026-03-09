export type SortType = 'AS_IS' | 'ALPHABETICAL' | 'REQUIRED_FIRST';
export type JavaStructureType = 'CLASS' | 'RECORD';
export type JsonPropertyMode = 'ALWAYS' | 'IF_NAME_CHANGED' | 'NEVER';
export type TSDeclarationStyle = 'INTERFACE' | 'TYPE_ALIAS';
export type TSEnumStyle = 'TS_ENUM' | 'UNION_STRING';

export interface BaseConfig {
  naming: { className: string };
  fields: { sort: SortType };
}

export interface JavaConfig {
  language: 'JAVA';
  base: BaseConfig;
  structure: { type: JavaStructureType };
  validation: { enabled: boolean };
  builder: { enabled: boolean; onlyIfMultipleFields: boolean };
  serialization: { jsonPropertyMode: JsonPropertyMode };
}

export interface TypeScriptConfig {
  language: 'TYPESCRIPT';
  base: BaseConfig;
  structure: { style: TSDeclarationStyle };
  enums: { style: TSEnumStyle };
}

export type GenerationConfig = JavaConfig | TypeScriptConfig;
