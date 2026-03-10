export interface BooleanSpecType {
  type: 'BOOLEAN';
  examples?: string[];
}

export interface IntegerSpecType {
  type: 'INTEGER';
  examples?: string[];
  minimum?: number;
  maximum?: number;
}

export interface DoubleSpecType {
  type: 'DOUBLE';
  examples?: string[];
  minimum?: number;
  maximum?: number;
}

export interface DecimalSpecType {
  type: 'DECIMAL';
  scale: number;
  examples?: string[];
  minimum?: number;
  maximum?: number;
}

export interface DateSpecType {
  type: 'DATE';
  format: string;
  examples?: string[];
}

export interface DateTimeSpecType {
  type: 'DATE_TIME';
  format: string;
  examples?: string[];
}

export interface TimeSpecType {
  type: 'TIME';
  format: string;
  examples?: string[];
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
  values: string[];
  examples?: string[];
}

export interface ObjectSpecType {
  type: 'OBJECT';
  children: SpecProperty[];
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

export interface SpecModel {
  wrapperType: WrapperType;
  properties: SpecProperty[];
}

export interface SpecProperty {
  name: string;
  type: SpecType;
  required: boolean;
  description: string;
  deprecated: boolean;
}
