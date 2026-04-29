// @ts-expect-error Monaco doesnt provide types for deep imports
import 'monaco-editor/esm/vs/basic-languages/java/java.contribution';
// @ts-expect-error Monaco doesnt provide types for deep imports
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';
// @ts-expect-error Monaco doesnt provide types for deep imports
import 'monaco-editor/esm/vs/language/json/monaco.contribution';

import { loader } from '@monaco-editor/react';
// @ts-expect-error Monaco doesnt provide types for deep imports
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new JsonWorker();
    }
    return new EditorWorker();
  },
};

loader.config({ monaco });
