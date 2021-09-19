import * as React from 'react';
import { Value$CustomComponentConfig } from '@ui-studio/types';
import { useSelector } from 'react-redux';
import { getSelectedRootElement } from 'selectors/tree';
import { OpenAPIV3 } from 'openapi-types';
import { Select } from '@faculty/adler-web-components';

import * as Styles from './ValueConfig.styles';

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

  const handleChange = ({ value: v }: any) => {
    handleValueChange({ mode: 'customComponentConfig', configKey: v });
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
      <Select
        label={`${customComponent.name} config`}
        value={options.find((o) => o.value === value.configKey)}
        onChange={handleChange}
        options={options}
      />
    </>
  );
};
