import { useCallback, useEffect, useMemo, useState } from 'react';
import { type UseFormReturn, useWatch } from 'react-hook-form';

import type { GenerationConfig } from '@/entities/config';
import { mapToSpecModel, mapToSpecTable, type SpecTable } from '@/entities/spec';
import { formatJson } from '@/shared/lib/json';

import { generatorApi } from './api.ts';
import type { GenerateResponseDto, Warning } from './types.ts';

export type GenerationSource = 'jsonSample' | 'jsonSchema' | 'specTable';

export const useGeneratorSync = (
  form: UseFormReturn<{
    jsonSample: string;
    jsonSchema: string;
    specTable: SpecTable;
    config: GenerationConfig;
    generationSource: GenerationSource;
    code: string;
    isSourceValid: boolean;
    warnings: Warning[];
  }>,
) => {
  const [genFromJsonSample, { isLoading: isJsonSampleLoading }] =
    generatorApi.useGenerateFromJsonSampleMutation();
  const [genFromJsonSchema, { isLoading: isJsonSchemaLoading }] =
    generatorApi.useGenerateFromJsonSchemaMutation();
  const [genFromSpecModel, { isLoading: isSpecModelLoading }] =
    generatorApi.useGenerateFromSpecModelMutation();

  const { setValue, control } = form;

  const generationConfig = useWatch({ control, name: 'config' });
  const jsonSample = useWatch({ control, name: 'jsonSample' });
  const jsonSchema = useWatch({ control, name: 'jsonSchema' });
  const specTable = useWatch({ control, name: 'specTable' });
  const generationSource = useWatch({ control, name: 'generationSource' });

  const activeJsonSample = generationSource === 'jsonSample' ? jsonSample : null;
  const activeJsonSchema = generationSource === 'jsonSchema' ? jsonSchema : null;
  const activeSpecTable = generationSource === 'specTable' ? specTable : null;

  const currentPayload = useMemo(
    () => ({
      source: generationSource,
      config: generationConfig,
      jsonSample: activeJsonSample,
      jsonSchema: activeJsonSchema,
      specTable: activeSpecTable,
    }),
    [generationSource, generationConfig, activeJsonSample, activeJsonSchema, activeSpecTable],
  );

  const [debouncedPayload, setDebouncedPayload] = useState(currentPayload);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPayload(currentPayload);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentPayload]);

  const isDebouncing = currentPayload !== debouncedPayload;
  const isGenerating =
    isJsonSampleLoading || isJsonSchemaLoading || isSpecModelLoading || isDebouncing;

  const handleResponse = useCallback(
    (data: GenerateResponseDto) => {
      if (generationSource !== 'jsonSample') {
        setValue('jsonSample', formatJson(data.jsonSample));
      }
      if (generationSource !== 'jsonSchema') {
        setValue('jsonSchema', formatJson(data.jsonSchema));
      }
      if (generationSource !== 'specTable') {
        setValue('specTable', mapToSpecTable(data.specModel));
      }
      setValue('code', data.code || '');
      setValue('warnings', data.warnings || []);
    },
    [setValue, generationSource],
  );

  useEffect(() => {
    const { source, config, jsonSample, jsonSchema, specTable } = debouncedPayload;

    const handleError = (e: unknown) => {
      console.error('Sync error:', e);
    };

    if (source === 'jsonSample' && jsonSample) {
      genFromJsonSample({ content: jsonSample, generationConfig: config })
        .unwrap()
        .then(handleResponse)
        .catch(handleError);
    } else if (source === 'jsonSchema' && jsonSchema) {
      genFromJsonSchema({ content: jsonSchema, generationConfig: config })
        .unwrap()
        .then(handleResponse)
        .catch(handleError);
    } else if (source === 'specTable' && specTable) {
      genFromSpecModel({ specModel: mapToSpecModel(specTable), generationConfig: config })
        .unwrap()
        .then(handleResponse)
        .catch(handleError);
    }
  }, [
    debouncedPayload,
    setValue,
    genFromJsonSample,
    genFromJsonSchema,
    genFromSpecModel,
    handleResponse,
  ]);

  return { isGenerating };
};
