export interface BooleanSpecType {
  type: 'BOOLEAN';
  examples: string[];
}

export interface IntegerSpecType {
  type: 'INTEGER';
  examples: string[];
  minimum?: number;
  maximum?: number;
}

export interface DoubleSpecType {
  type: 'DOUBLE';
  examples: string[];
  minimum?: number;
  maximum?: number;
}

export interface DecimalSpecType {
  type: 'DECIMAL';
  examples: string[];
  scale: number;
  minimum?: number;
  maximum?: number;
}

export interface DateSpecType {
  type: 'DATE';
  examples: string[];
  format: string;
}

export interface DateTimeSpecType {
  type: 'DATE_TIME';
  examples: string[];
  format: string;
}

export interface TimeSpecType {
  type: 'TIME';
  examples: string[];
  format: string;
}

export interface StringSpecType {
  type: 'STRING';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: 'EMAIL' | 'UUID';
  examples?: string[];
}

export interface EnumSpecType {
  type: 'ENUM';
  examples: string[];
  values: string[];
}

export interface ObjectSpecType {
  type: 'OBJECT';
}

export interface ListSpecType {
  type: 'LIST';
  valueType: SpecType;
  minItems?: number;
  maxItems?: number;
}

export interface MapSpecType {
  type: 'MAP';
  keyType: SpecType;
  valueType: SpecType;
}

export type SpecType =
  | BooleanSpecType
  | IntegerSpecType
  | DoubleSpecType
  | DecimalSpecType
  | TimeSpecType
  | DateSpecType
  | DateTimeSpecType
  | StringSpecType
  | EnumSpecType
  | ObjectSpecType
  | ListSpecType
  | MapSpecType;

export type WrapperType = 'OBJECT' | 'LIST';

export interface SpecTable {
  wrapperType: WrapperType;
  specRows: SpecRow[];
}

export interface SpecRow {
  id: string;
  depth: number;
  name: string;
  type: SpecType;
  required: boolean;
  description: string;
  deprecated: boolean;
  error?: Error;
}

export interface Error {
  message: string;
}
