import './monaco-editor-setup.ts';

import { Editor, type EditorProps } from '@monaco-editor/react';

export default function JsonMonacoEditor(props: EditorProps) {
  return <Editor defaultLanguage="json" theme="github" width="100%" height="70vh" {...props} />;
}
