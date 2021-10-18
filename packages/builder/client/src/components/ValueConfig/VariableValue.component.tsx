import * as React from 'react';
import { Value$Variable } from '@ui-studio/types';
import { OpenAPIV3 } from 'openapi-types';
import { useSelector } from 'react-redux';
import { getVariables } from 'selectors/variable';
import { Store } from 'types/store';
import { Select } from '@faculty/adler-web-components';
import { compareSchemas, getResponseSchemaForEndpoint, getSchemaForLookup } from 'utils/openapi';

type Props = {
  value: Value$Variable;
  schema: OpenAPIV3.SchemaObject;
  handleValueChange: (value: Value$Variable) => any;
};

export const VariableValue = ({ value, schema, handleValueChange }: Props) => {
  const openAPISchema = useSelector<Store, OpenAPIV3.Document>(
    (state) => state.configuration.openAPISchema,
  );

  const allVariables = useSelector(getVariables);
  const variables = Object.values(allVariables).filter((v) => {
    try {
      if (v.type === 'static') {
        if (v.valueType === 'number' && schema.type === 'integer') return true;
        if (v.valueType === schema.type) return true;
        return false;
      }

      if (v.type === 'function') {
        const functionVariableSchema = getResponseSchemaForEndpoint(
          openAPISchema,
          v.functionId.path,
          v.functionId.method,
        );
        if (!functionVariableSchema) return false;

        return compareSchemas(schema, functionVariableSchema);
      }

      if (v.type === 'lookup') {
        const referencedVariable = allVariables[v.variableId];
        if (referencedVariable.type !== 'function') throw new Error();
        const responseSchema = getResponseSchemaForEndpoint(
          openAPISchema,
          referencedVariable.functionId.path,
          referencedVariable.functionId.method,
        );
        const lookupSchema = getSchemaForLookup(responseSchema, v.lookup);
        return compareSchemas(schema, lookupSchema);
      }
    } catch {
      return false;
    }
    return false;
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
