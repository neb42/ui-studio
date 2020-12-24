import * as React from 'react';
import { useDispatch } from 'react-redux';
import AceEditor from 'react-ace';
import { Element } from '@ui-builder/types';

import * as Styles from './CSSInput.styles';

import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/worker-css';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/ext-language_tools';

interface ICSSInput {
  element: Element;
}

export const CSSInput = ({ element }: ICSSInput): JSX.Element => {
  const dispatch = useDispatch();

  const handleOnChange = (value: string) => undefined;

  return (
    <Styles.Container>
      <Styles.Header>CSS</Styles.Header>
      <AceEditor
        name={`${element.name}-css-editor`}
        mode="css"
        theme="chrome"
        defaultValue={element.style.css}
        onChange={handleOnChange}
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="300px"
        tabSize={2}
        wrapEnabled
        highlightActiveLine={false}
        showGutter={false}
        showPrintMargin={false}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
        style={{
          padding: '8px',
          fontFamily: 'Menlo, monospace',
        }}
      />
    </Styles.Container>
  );
};
