import * as React from 'react';
import { Value$Iterable } from '@ui-studio/types';
import { Select } from '@faculty/adler-web-components';
import TextField from '@mui/material/TextField';
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

  const handleWidgetChange = ({ value: v }: any) => {
    handleValueChange({
      ...value,
      widgetId: v as string,
      propKey: '', // TODO prepopulate
      lookup: '',
    });
  };

  const handlePropKeyChange = ({ value: v }: any) => {
    handleValueChange({
      ...value,
      propKey: v as string,
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
  const widgetValue = {
    value: value.widgetId,
    label: iterables.find((it) => it.widgetId === value.widgetId)?.widgetName,
  };

  const propKeyOptions =
    iterables
      .find((it) => it.widgetId === value.widgetId)
      ?.propKeys.map((k) => ({ label: k, value: k })) ?? [];
  const propKeyValue = { label: value.propKey, value: value.propKey };

  React.useEffect(() => {
    if (value.widgetId && propKeyOptions.length > 0)
      handleValueChange({
        ...value,
        propKey: propKeyOptions[0].value,
      });
  }, [value.widgetId]);

  return (
    <>
      <Select
        label="Iterator widget"
        value={widgetValue}
        onChange={handleWidgetChange}
        options={widgetOptions}
      />
      <Select
        label="Iterator prop"
        value={propKeyValue}
        onChange={handlePropKeyChange}
        options={propKeyOptions}
      />
      <TextField label="Property" onChange={handleLookupChange} value={value.lookup} />
    </>
  );
};
