import * as React from 'react';
import AceEditor from 'react-ace';
import { Value$Static } from '@ui-studio/types';
import { OpenAPIV3 } from 'openapi-types';
import { useTheme } from 'styled-components';
import { Checkbox, Input, Select } from '@faculty/adler-web-components';

type Props = {
  value: Value$Static;
  schema: OpenAPIV3.SchemaObject;
  handleValueChange: (value: Value$Static) => any;
};

export const StaticValue = ({ value, schema, handleValueChange }: Props) => {
  const theme = useTheme();
  const [hasFocus, setHasFocus] = React.useState(false);

  const handleInputOnChange = (v: string) => handleValueChange({ ...value, value: v });
  const handleJSONOnChange = (v: string) => {
    try {
      handleValueChange({ ...value, value: JSON.parse(v) });
    } catch {
      handleValueChange({ ...value, value: v });
    }
  };
  const handleSelectOnChange = ({ value: v }: any) => {
    handleValueChange({ ...value, value: v });
  };
  const handleCheckboxOnChange = (v: boolean) => handleValueChange({ ...value, value: v });

  if (schema.type === 'array' || schema.type === 'object') {
    const valueString = (() => {
      if (typeof value.value === 'object') return JSON.stringify(value.value);
      return value.value.toString();
    })();
    return (
      <AceEditor
        mode="json"
        theme="chrome"
        defaultValue={valueString}
        onChange={handleJSONOnChange}
        editorProps={{ $blockScrolling: true }}
        width="100%"
        height="300px"
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
          padding: '8px',
          border: `1px solid ${
            hasFocus ? theme.input.border.color.focused : theme.input.border.color.default
          }`,
          fontFamily: 'Menlo, monospace',
          transition: 'border 300ms ease-in-out',
        }}
      />
    );
  }

  if (schema.type === 'string') {
    if (typeof value.value !== 'string') throw new Error();
    if ('enum' in schema) {
      const options = schema.enum?.map((e) => ({ value: e, label: e })) ?? [];
      return (
        <Select
          value={options.find((o) => o.value === value.value)}
          options={options}
          onChange={handleSelectOnChange}
        />
      );
    }
    return <Input onChange={handleInputOnChange} value={value.value} />;
  }

  if (schema.type === 'number') {
    if (typeof value.value !== 'number') throw new Error();
    return <Input onChange={handleInputOnChange} value={value.value} />;
  }

  if (schema.type === 'boolean') {
    if (typeof value.value !== 'boolean') throw new Error();
    return (
      <Checkbox checked={value.value} onChange={handleCheckboxOnChange} controlled>
        label
      </Checkbox>
    );
  }

  return null;
};
