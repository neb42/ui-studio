import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from 'styled-components';
import AceEditor from 'react-ace';
import TextField from '@mui/material/TextField';
import { StaticVariable } from '@ui-studio/types';
import Select from '@faculty/adler-web-components/atoms/Select';
import { updateStaticVariable } from 'actions/variable';

const valueTypeOptions = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'object', label: 'Object' },
];

const booleanOptions = [
  { value: true, label: 'True' },
  { value: false, label: 'False' },
];

interface Props {
  variable: StaticVariable;
}

export const StaticVariableConfig = ({ variable }: Props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [hasFocus, setHasFocus] = React.useState(false);

  const handleValueTypeChange = ({ value }: any) => {
    const v = value as 'string' | 'number' | 'boolean' | 'object';
    if (v === 'string') dispatch(updateStaticVariable(variable.id, 'string', ''));
    if (v === 'number') dispatch(updateStaticVariable(variable.id, 'number', 0));
    if (v === 'boolean') dispatch(updateStaticVariable(variable.id, 'boolean', true));
    if (v === 'object') dispatch(updateStaticVariable(variable.id, 'object', ''));
  };

  const handleStringValueChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(updateStaticVariable(variable.id, 'string', event.target.value));

  const handleNumberValueChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(updateStaticVariable(variable.id, 'number', Number(event.target.value)));

  const handleBooleanValueChange = ({ value }: any) =>
    dispatch(updateStaticVariable(variable.id, 'boolean', value as boolean));

  const handleObjectValueChange = (value: string) =>
    dispatch(updateStaticVariable(variable.id, 'object', value as string));

  return (
    <>
      <Select
        label="Value type"
        value={valueTypeOptions.find((o) => o.value === variable.valueType)}
        onChange={handleValueTypeChange}
        options={valueTypeOptions}
      />
      {variable.valueType === 'string' && (
        <TextField label="Value" value={variable.value} onChange={handleStringValueChange} />
      )}
      {variable.valueType === 'number' && (
        <TextField
          label="Value"
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          value={variable.value}
          onChange={handleNumberValueChange}
        />
      )}
      {variable.valueType === 'boolean' && (
        <Select
          value={booleanOptions.find((o) => o.value === variable.value)}
          onChange={handleBooleanValueChange}
          options={booleanOptions}
        />
      )}
      {variable.valueType === 'object' && (
        <AceEditor
          mode="json"
          theme="chrome"
          defaultValue={variable.value}
          onChange={handleObjectValueChange}
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
      )}
    </>
  );
};
