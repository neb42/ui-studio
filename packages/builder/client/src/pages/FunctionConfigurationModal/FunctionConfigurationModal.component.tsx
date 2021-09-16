import * as React from 'react';
import { OpenAPIV3 } from 'openapi-types';
import { Event$TriggerAction, FunctionVariable, FunctionVariableArg } from '@ui-studio/types';
import { FunctionVariableArgConfig } from 'components/Variables/FunctionVariableArgConfig';

import * as Styles from './FunctionConfigurationModal.styles';

type Props = {
  schema: OpenAPIV3.OperationObject;
  config: FunctionVariable | Event$TriggerAction;
  onPathParamChange: (key: string, arg: FunctionVariableArg) => any;
  onQueryStringParamChange: (key: string, arg: FunctionVariableArg) => any;
  onBodyParamChange: (key: string, arg: FunctionVariableArg) => any;
};

export const FunctionConfigurationModalComponent = ({
  schema,
  config,
  onPathParamChange,
  onQueryStringParamChange,
  onBodyParamChange,
}: Props) => {
  if (!schema) throw new Error();
  return (
    <Styles.Container>
      <span>Path parameters:</span>
      {schema.parameters
        ?.filter(
          (p): p is OpenAPIV3.ParameterObject =>
            !('ref' in p) && (p as OpenAPIV3.ParameterObject).in === 'path',
        )
        .map((p) => (
          <FunctionVariableArgConfig
            key={p.name}
            name={p.name}
            valueType="string"
            arg={config.args.path[p.name]}
            onChange={onPathParamChange}
          />
        ))}
      <span>Query string parameters:</span>
      {schema.parameters
        ?.filter(
          (p): p is OpenAPIV3.ParameterObject =>
            !('ref' in p) && (p as OpenAPIV3.ParameterObject).in === 'query',
        )
        .map((p) => (
          <FunctionVariableArgConfig
            key={p.name}
            name={p.name}
            valueType="string"
            arg={config.args.query[p.name]}
            onChange={onQueryStringParamChange}
          />
        ))}
      <span>Body parameters:</span>
      {schema.parameters
        ?.filter(
          (p): p is OpenAPIV3.ParameterObject =>
            !('ref' in p) && (p as OpenAPIV3.ParameterObject).in === 'query',
        )
        .map((p) => (
          <FunctionVariableArgConfig
            key={p.name}
            name={p.name}
            valueType="string"
            arg={config.args.body[p.name]}
            onChange={onBodyParamChange}
          />
        ))}
    </Styles.Container>
  );
};
