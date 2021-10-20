import * as React from 'react';
import { useDispatch } from 'react-redux';
import AceEditor from 'react-ace';
import { useTheme } from 'styled-components';
import { Element } from '@ui-studio/types';

import { updateElementCSS } from 'actions/styles';

import * as Styles from './CSSInput.styles';
import { Outline } from 'components/Outline';

interface ICSSInput {
  element: Element;
}

export const CSSInput = ({ element }: ICSSInput): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [hasFocus, setHasFocus] = React.useState(false);

  const handleOnChange = (value: string) => dispatch(updateElementCSS(value));

  return (
    <Outline label="CSS">
      <AceEditor
        name={`${element.id}-css-editor`}
        mode="css"
        theme="chrome"
        defaultValue={element.style.css}
        onChange={handleOnChange}
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="250px"
        tabSize={2}
        wrapEnabled
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        highlightActiveLine={false}
        showGutter={false}
        showPrintMargin={false}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
        style={{
          fontFamily: 'Menlo, monospace',
        }}
      />
    </Outline>
  );
};
