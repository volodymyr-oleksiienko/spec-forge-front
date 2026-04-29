import './monaco-editor-setup.ts';

import { Editor, type EditorProps } from '@monaco-editor/react';

export default function CodeMonacoEditor(props: EditorProps) {
  return (
    <Editor
      {...props}
      theme="github"
      width="100%"
      height="70vh"
      options={{
        readOnly: true,
      }}
    />
  );
}
