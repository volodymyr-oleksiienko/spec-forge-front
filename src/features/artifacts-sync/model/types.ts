import type { GenerationConfig } from '@/entities/config';
import type { SpecModelTypes } from '@/entities/spec';

export interface GenerateFromRawRequestDto {
  content: string;
  generationConfig?: GenerationConfig;
}

export interface GenerateFromSpecModelRequestDto {
  specModel: SpecModelTypes.SpecModel;
  generationConfig?: GenerationConfig;
}

export interface GenerateResponseDto {
  jsonSample: string;
  jsonSchema: string;
  specModel: SpecModelTypes.SpecModel;
  code?: string;
  warnings?: Warning[];
}

export interface Warning {
  devMessage: string;
  errorCode: string;
}
