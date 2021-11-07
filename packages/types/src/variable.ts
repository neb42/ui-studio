import { OpenAPIV3 } from 'openapi-types';

import { Value$Static, Value$Variable, Value$Widget } from './value';

export interface BaseVariable {
  id: string;
  name: string;
}

export type StaticVariable = BaseVariable & {
  type: 'static';
} & (
    | { valueType: 'string'; value: string }
    | { valueType: 'number'; value: number }
    | { valueType: 'boolean'; value: boolean }
  );

export type LookupVariable = BaseVariable & {
  type: 'lookup';
  variableId: string;
  lookup: string;
};

export type FunctionVariableArg = Value$Static | Value$Variable | Value$Widget;

export interface FunctionVariable extends BaseVariable {
  type: 'function';
  functionId: {
    path: string;
    method: OpenAPIV3.HttpMethods;
  };
  trigger: 'auto' | 'event';
  args: {
    path: Record<string, FunctionVariableArg>;
    query: Record<string, FunctionVariableArg>;
    body: Record<string, FunctionVariableArg>;
  };
}

export type Variable = FunctionVariable | StaticVariable | LookupVariable;
