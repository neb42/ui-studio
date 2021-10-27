import * as React from 'react';
import AceEditor from 'react-ace';
import { useTheme } from 'styled-components';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import { OpenAPIV3 } from 'openapi-types';
import { Value$Static } from '@ui-studio/types';

type Props = {
  value: Value$Static;
  schema: OpenAPIV3.SchemaObject;
  handleValueChange: (value: Value$Static) => any;
};

export const StaticValue = ({ value, schema, handleValueChange }: Props) => {
  const theme = useTheme();
  const [hasFocus, setHasFocus] = React.useState(false);

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (schema.type === 'number' || schema.type === 'integer') {
      handleValueChange({ ...value, value: Number(event.target.value) });
    } else {
      handleValueChange({ ...value, value: event.target.value });
    }
  };

  const handleJSONOnChange = (v: string) => {
    try {
      handleValueChange({ ...value, value: JSON.parse(v) });
    } catch {
      handleValueChange({ ...value, value: v });
    }
  };

  const handleSelectOnChange = (event: SelectChangeEvent) => {
    handleValueChange({ ...value, value: event.target.value });
  };

  const handleBooleanOnChange = (_: React.MouseEvent<HTMLElement>, v: boolean) => {
    if (v !== null) handleValueChange({ ...value, value: v });
  };

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
          border: `1px solid ${hasFocus ? theme.palette.primary.main : theme.palette.divider}`,
          borderRadius: '3px',
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
        <FormControl fullWidth>
          <Select value={value.value} onChange={handleSelectOnChange}>
            {options.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
    return <TextField onChange={handleInputOnChange} value={value.value} />;
  }

  if (schema.type === 'number' || schema.type === 'integer') {
    if (typeof value.value !== 'number') throw new Error();
    return (
      <TextField
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        onChange={handleInputOnChange}
        value={value.value}
      />
    );
  }

  if (schema.type === 'boolean') {
    if (typeof value.value !== 'boolean') throw new Error();
    return (
      <ToggleButtonGroup
        value={value.value}
        exclusive
        onChange={handleBooleanOnChange}
        fullWidth
        color="primary"
        size="small"
      >
        <ToggleButton value>True</ToggleButton>
        <ToggleButton value={false}>False</ToggleButton>
      </ToggleButtonGroup>
    );
  }

  return null;
};
