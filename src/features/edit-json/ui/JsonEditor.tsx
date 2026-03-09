import { Editor } from '@monaco-editor/react';
import { useFormContext } from 'react-hook-form';

import { isValidSpecJson } from '@/shared/lib/json';

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
    <Editor
      defaultValue={value}
      onChange={handleChange}
      defaultLanguage="json"
      theme="github"
      width="100%"
      height="70vh"
      options={{
        readOnly,
      }}
    />
  );
};
