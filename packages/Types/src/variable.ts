export interface BaseVariable {
  id: string;
  name: string;
}

export type StaticVariable = BaseVariable & {
  type: 'static';
} & (
  | { valueType: 'string'; value: string}
  | { valueType: 'number'; value: number }
  | { valueType: 'boolean'; value: boolean}
  | { valueType: 'object'; value: string }
);

// export type LookupVariable = BaseVariable & {
//   type: 'lookup';
//   variableId: string;
//   value: string;
// };

export type FunctionVariable$StaticArg = {
  type: 'static',
} & (
  | { valueType: 'string'; value: string}
  | { valueType: 'number'; value: number }
  | { valueType: 'boolean'; value: boolean}
);

export interface FunctionVariable$VariableArg {
  type: 'variable',
  variableId: string;
}

export interface FunctionVariable$WidgetArg {
  type: 'widget',
  widgetId: string;
  property: string;
}

export type FunctionVariableArg = FunctionVariable$StaticArg | FunctionVariable$VariableArg | FunctionVariable$WidgetArg;

export interface FunctionVariable extends BaseVariable {
  type: 'function';
  functionId: string;
  valueType: 'string' | 'number' | 'boolean' | 'object';
  trigger: 'auto' | 'event';
  args: FunctionVariableArg[],
}

export type Variable = FunctionVariable | StaticVariable;
