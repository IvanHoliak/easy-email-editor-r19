import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';

import styles from './index.module.scss';

export default function CodemirrorEditor(props: {
  value: string;
  onChange(val: string): void;
}) {
  const { value, onChange } = props;
  return (
    <CodeMirror
      className={styles.container}
      value={value}
      onChange={onChange}
      extensions={[xml()]}
      height="auto"
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: true,
      }}
    />
  );
}
