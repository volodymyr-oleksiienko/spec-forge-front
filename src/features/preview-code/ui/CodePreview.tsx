import { lazy } from 'react';
import { useFormContext } from 'react-hook-form';

import type { GenerationConfig } from '@/entities/config';

const CodeMonacoEditor = lazy(() => import('@/shared/ui/MonacoEditor/CodeMonacoEditor'));

export const CodePreview = () => {
  const { watch } = useFormContext<{ code: string; config: GenerationConfig }>();

  const value = watch('code');
  const language = watch('config.language');

  return <CodeMonacoEditor value={value} defaultLanguage={language.toLowerCase()} />;
};
