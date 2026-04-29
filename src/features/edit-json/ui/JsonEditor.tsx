import { lazy } from 'react';
import { useFormContext } from 'react-hook-form';

import { isValidSpecJson } from '@/shared/lib/json';

const JsonMonacoEditor = lazy(() => import('@/shared/ui/MonacoEditor/JsonMonacoEditor'));

export const JsonEditor = ({
  fieldName,
  readOnly,
}: {
  fieldName: 'jsonSample' | 'jsonSchema';
  readOnly: boolean;
}) => {
  const { watch, setValue } = useFormContext<{
    isSourceValid: boolean;
    jsonSample: string;
    jsonSchema: string;
  }>();
  const value = watch(fieldName) as string;

  const handleChange = (json?: string) => {
    const isValid = isValidSpecJson(json);
    setValue('isSourceValid', isValid);
    if (isValid) {
      setValue(fieldName, json!);
    }
  };

  return (
    <JsonMonacoEditor
      defaultValue={value}
      onChange={handleChange}
      options={{
        readOnly,
      }}
    />
  );
};
