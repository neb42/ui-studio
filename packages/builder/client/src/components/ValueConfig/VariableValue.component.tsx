import * as React from 'react';
import { Value$Variable } from '@ui-studio/types';
import { OpenAPIV3 } from 'openapi-types';
import { useSelector } from 'react-redux';
import { getVariables } from 'selectors/variable';
import { Store } from 'types/store';
import { Select } from '@faculty/adler-web-components';

import * as Styles from './ValueConfig.styles';

type Props = {
  value: Value$Variable;
  schema: OpenAPIV3.SchemaObject;
  handleValueChange: (value: Value$Variable) => any;
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

// TODO: support an array or object variable with a type safe lookup

export const VariableValue = ({ value, schema, handleValueChange }: Props) => {
  const openAPISchema = useSelector<Store, OpenAPIV3.Document>(
    (state) => state.configuration.openAPISchema,
  );

  const variables = Object.values(useSelector(getVariables)).filter((v) => {
    if (v.type === 'static') {
      if (v.valueType === 'number' && schema.type === 'integer') return true;
      if (v.valueType === schema.type) return true;
      return false;
    }

    const functionVariableSchema = openAPISchema.paths?.[v.functionId.path]?.[v.functionId.method];
    if (!functionVariableSchema) return false;

    return compareSchemas(schema, functionVariableSchema);
  });

  const selectedVariableId = value.variableId;
  const selectedVariable = variables.find((v) => v.id === selectedVariableId);

  const handleVariableChange = ({ value: v }: any) => {
    handleValueChange({ mode: 'variable', variableId: v });
  };

  return (
    <Select
      label="Variable"
      value={selectedVariable ? { value: selectedVariable.id, label: selectedVariable.name } : null}
      onChange={handleVariableChange}
      options={variables.map((v) => ({ value: v.id, label: v.name }))}
    />
  );
};
