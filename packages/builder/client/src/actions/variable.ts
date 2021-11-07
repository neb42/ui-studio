import { Dispatch } from 'redux';
import { v4 as uuidv4 } from 'uuid';
import { OpenAPIV3 } from 'openapi-types';
import { Variable, FunctionVariableArg, FunctionVariable, LookupVariable } from '@ui-studio/types';
import { TGetState, TThunkAction } from 'types/store';
import { selectVariable, SelectVariable } from 'actions/view';
import { VariableModel } from 'models/variable';

import { resetVariableFunctionArgsUsingVariable, resetWidgetPropsUsingVariable } from './foo';

interface AddVariable {
  type: 'ADD_VARIABLE';
  payload: Variable;
}

export const ADD_VARIABLE = 'ADD_VARIABLE';

export const addVariable = (): TThunkAction<AddVariable> => (
  dispatch: Dispatch<AddVariable | SelectVariable>,
) => {
  const variable: Variable = {
    id: uuidv4(),
    name: 'New variable',
    type: 'static',
    valueType: 'string',
    value: '',
  };

  dispatch(selectVariable(variable.id));

  return dispatch({
    type: ADD_VARIABLE,
    payload: variable,
  });
};

export interface RemoveVariable {
  type: 'REMOVE_VARIABLE';
  payload: string;
}

export const REMOVE_VARIABLE = 'REMOVE_VARIABLE';

export const removeVariable = (id: string): TThunkAction<RemoveVariable> => (
  dispatch: Dispatch<RemoveVariable>,
) => {
  dispatch(resetWidgetPropsUsingVariable(id));
  dispatch(resetVariableFunctionArgsUsingVariable(id));
  return dispatch({
    type: REMOVE_VARIABLE,
    payload: id,
  });
};

interface UpdateVariableName {
  type: 'UPDATE_VARIABLE_NAME';
  payload: { id: string; name: string };
}

export const UPDATE_VARIABLE_NAME = 'UPDATE_VARIABLE_NAME';

export const updateVariableName = (id: string, name: string): UpdateVariableName => ({
  type: UPDATE_VARIABLE_NAME,
  payload: { id, name },
});

interface UpdateVariableType {
  type: 'UPDATE_VARIABLE_TYPE';
  payload: {
    id: string;
    type: 'static' | 'function';
    openAPISchema: OpenAPIV3.Document;
  };
}

export const UPDATE_VARIABLE_TYPE = 'UPDATE_VARIABLE_TYPE';

export const updateVariableType = (
  id: string,
  type: 'static' | 'function',
): TThunkAction<UpdateVariableType> => (
  dispatch: Dispatch<UpdateVariableType>,
  getState: TGetState,
) => {
  const state = getState();

  dispatch(resetWidgetPropsUsingVariable(id));
  dispatch(resetVariableFunctionArgsUsingVariable(id));
  return dispatch({
    type: UPDATE_VARIABLE_TYPE,
    payload: { id, type, openAPISchema: state.configuration.openAPISchema },
  });
};

interface UpdateStaticVariable$String {
  type: 'UPDATE_STATIC_VARIABLE';
  payload: {
    id: string;
    valueType: 'string';
    value: string;
  };
}

interface UpdateStaticVariable$Number {
  type: 'UPDATE_STATIC_VARIABLE';
  payload: {
    id: string;
    valueType: 'number';
    value: number;
  };
}

interface UpdateStaticVariable$Boolean {
  type: 'UPDATE_STATIC_VARIABLE';
  payload: {
    id: string;
    valueType: 'boolean';
    value: boolean;
  };
}

type UpdateStaticVariable =
  | UpdateStaticVariable$String
  | UpdateStaticVariable$Number
  | UpdateStaticVariable$Boolean;

export const UPDATE_STATIC_VARIABLE = 'UPDATE_STATIC_VARIABLE';

export function updateStaticVariable(
  id: string,
  valueType: 'string',
  value: string,
): UpdateStaticVariable$String;
export function updateStaticVariable(
  id: string,
  valueType: 'number',
  value: number,
): UpdateStaticVariable$Number;
export function updateStaticVariable(
  id: string,
  valueType: 'boolean',
  value: boolean,
): UpdateStaticVariable$Boolean;
export function updateStaticVariable(id: string, valueType: any, value: any): any {
  return (dispatch: Dispatch<UpdateStaticVariable>, getState: TGetState) => {
    const state = getState();
    const variable = state.variable[id];
    if (
      VariableModel.getValueType(variable, state.configuration.openAPISchema, state.variable) !==
      valueType
    ) {
      dispatch(resetWidgetPropsUsingVariable(id));
      dispatch(resetVariableFunctionArgsUsingVariable(id));
    }
    return dispatch({
      type: UPDATE_STATIC_VARIABLE,
      payload: {
        id,
        valueType,
        value,
      },
    });
  };
}

interface UpdateFunctionVariable {
  type: 'UPDATE_FUNCTION_VARIABLE';
  payload: {
    id: string;
    functionId: {
      path: string;
      method: OpenAPIV3.HttpMethods;
    };
    trigger: 'auto' | 'event';
    args: FunctionVariable['args'];
  };
}

export const UPDATE_FUNCTION_VARIABLE = 'UPDATE_FUNCTION_VARIABLE';

export const updateFunctionVariable = (
  id: string,
  functionId: {
    path: string;
    method: OpenAPIV3.HttpMethods;
  },
  trigger: 'auto' | 'event',
  args: FunctionVariable['args'],
): UpdateFunctionVariable => ({
  type: UPDATE_FUNCTION_VARIABLE,
  payload: {
    id,
    functionId,
    trigger,
    args,
  },
});

export interface UpdateVariableFunctionArg {
  type: 'UPDATE_VARIABLE_FUNCTION_ARG';
  payload: {
    variableId: string;
    argType: keyof FunctionVariable['args'];
    argKey: string;
    arg: FunctionVariableArg;
  };
}

export const UPDATE_VARIABLE_FUNCTION_ARG = 'UPDATE_VARIABLE_FUNCTION_ARG';

interface UpdateLookupVariable {
  type: 'UPDATE_LOOKUP_VARIABLE';
  payload: LookupVariable;
}

export const UPDATE_LOOKUP_VARIABLE = 'UPDATE_LOOKUP_VARIABLE';

export const updateLookupVariable = (
  id: string,
  variable: LookupVariable,
): UpdateLookupVariable => ({
  type: UPDATE_LOOKUP_VARIABLE,
  payload: variable,
});

export type Action$Variable =
  | AddVariable
  | RemoveVariable
  | UpdateVariableName
  | UpdateVariableType
  | UpdateStaticVariable
  | UpdateFunctionVariable
  | UpdateVariableFunctionArg
  | UpdateLookupVariable;
