import * as React from 'react';
import { Value$Iterable } from '@ui-studio/types';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useSelector } from 'react-redux';
import { OpenAPIV3 } from 'openapi-types';
import { getAvailableIteratorKeys } from 'selectors/element';

type Props = {
  id: string;
  value: Value$Iterable;
  schema: OpenAPIV3.SchemaObject;
  handleValueChange: (value: Value$Iterable) => any;
};

export const IterableValue = ({ id, value, schema, handleValueChange }: Props) => {
  const iterables = useSelector(getAvailableIteratorKeys)(id);

  const handleWidgetChange = (event: SelectChangeEvent) => {
    handleValueChange({
      ...value,
      widgetId: event.target.value as string,
      propKey: '', // TODO prepopulate
      lookup: '',
    });
  };

  const handlePropKeyChange = (event: SelectChangeEvent) => {
    handleValueChange({
      ...value,
      propKey: event.target.value as string,
      lookup: '',
    });
  };

  const handleLookupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleValueChange({
      ...value,
      lookup: event.target.value,
    });
  };

  const widgetOptions = iterables.map((it) => ({ label: it.widgetName, value: it.widgetId }));

  const propKeyOptions =
    iterables
      .find((it) => it.widgetId === value.widgetId)
      ?.propKeys.map((k) => ({ label: k, value: k })) ?? [];

  React.useEffect(() => {
    if (value.widgetId && propKeyOptions.length > 0)
      handleValueChange({
        ...value,
        propKey: propKeyOptions[0].value,
      });
  }, [value.widgetId]);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>Iterator widget</InputLabel>
        <Select value={value.widgetId} label="Iterator widget" onChange={handleWidgetChange}>
          {widgetOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Iterator prop</InputLabel>
        <Select value={value.propKey} label="Iterator prop" onChange={handlePropKeyChange}>
          {propKeyOptions.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField label="Property" onChange={handleLookupChange} value={value.lookup} />
    </>
  );
};
