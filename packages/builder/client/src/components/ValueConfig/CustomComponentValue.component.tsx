import * as React from 'react';
import { useSelector } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { OpenAPIV3 } from 'openapi-types';
import { Value$CustomComponentConfig } from '@ui-studio/types';
import { getSelectedRootElement } from 'selectors/tree';

type Props = {
  value: Value$CustomComponentConfig;
  schema: OpenAPIV3.SchemaObject;
  handleValueChange: (value: Value$CustomComponentConfig) => any;
};

const compareSchemas = (a: OpenAPIV3.SchemaObject, b: OpenAPIV3.SchemaObject): boolean => {
  if (a.type !== b.type) return false;
  if (a.type === 'array' && b.type === 'array') {
    const { items: itemsA } = a;
    const { items: itemsB } = b;
    if ('ref' in itemsA || 'ref' in itemsB) throw new Error();
    return compareSchemas(a.items as OpenAPIV3.SchemaObject, b.items as OpenAPIV3.SchemaObject);
  }
  if (a.type === 'object' && b.type === 'object') {
    const aKeys = Object.keys(a.properties || {}).sort();
    const bKeys = Object.keys(b.properties || {}).sort();
    if (JSON.stringify(aKeys) !== JSON.stringify(bKeys)) return false;

    return Object.keys(a.properties || {}).every((k) => {
      const aSchema = a.properties?.[k];
      const bSchema = b.properties?.[k];
      if (!aSchema || !bSchema || 'ref' in aSchema || 'ref' in bSchema) throw new Error();
      return compareSchemas(aSchema as OpenAPIV3.SchemaObject, bSchema as OpenAPIV3.SchemaObject);
    });
  }
  return true;
};

export const CustomComponentValue = ({ value, schema, handleValueChange }: Props) => {
  const customComponent = useSelector(getSelectedRootElement);

  if (!customComponent || customComponent.type !== 'customComponent' || schema.type === 'object')
    throw new Error();

  const handleChange = (event: SelectChangeEvent) => {
    handleValueChange({ mode: 'customComponentConfig', configKey: event.target.value });
  };

  const options =
    customComponent?.config?.reduce<{ label: string; value: string }[]>((acc, cur) => {
      if (compareSchemas(schema, cur.schema)) {
        return [...acc, { label: cur.label, value: cur.key }];
      }
      return acc;
    }, []) ?? [];

  return (
    <>
      <FormControl fullWidth>
        <InputLabel>{customComponent.name} config</InputLabel>
        <Select
          value={value.configKey}
          label={`${customComponent.name} config`}
          onChange={handleChange}
        >
          {options.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
