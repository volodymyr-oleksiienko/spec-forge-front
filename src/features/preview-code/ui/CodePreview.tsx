import { Editor } from '@monaco-editor/react';
import { useFormContext } from 'react-hook-form';

import type { GenerationConfig } from '@/entities/config';

export const CodePreview = () => {
  const { watch } = useFormContext<{ code: string; config: GenerationConfig }>();

  const value = watch('code');
  const language = watch('config.language');

  return (
    <Editor
      value={value}
      defaultLanguage={language.toLowerCase()}
      theme="github"
      width="100%"
      height="70vh"
      options={{
        readOnly: true,
      }}
    />
  );
};
