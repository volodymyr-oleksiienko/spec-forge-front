import { api } from '@/shared/api';

import type {
  GenerateFromRawRequestDto,
  GenerateFromSpecModelRequestDto,
  GenerateResponseDto,
} from './types.ts';

export const generatorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    generateFromJsonSample: builder.mutation<GenerateResponseDto, GenerateFromRawRequestDto>({
      query: (body) => ({ method: 'POST', url: '/artifacts/from-json-sample', body }),
    }),
    generateFromJsonSchema: builder.mutation<GenerateResponseDto, GenerateFromRawRequestDto>({
      query: (body) => ({ method: 'POST', url: '/artifacts/from-json-schema', body }),
    }),
    generateFromSpecModel: builder.mutation<GenerateResponseDto, GenerateFromSpecModelRequestDto>({
      query: (body) => ({ method: 'POST', url: '/artifacts/from-spec-model', body }),
    }),
  }),
});
