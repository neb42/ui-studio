import { Dispatch } from 'redux';
import { v4 as uuidv4 } from 'uuid';
import { Variable, FunctionVariableArg } from '@ui-builder/types';
import { TGetState, TThunkAction } from 'types/store';

export interface SelectVariable {
  type: 'SELECT_VARIABLE';
  payload: string;
}

export const SELECT_VARIABLE = 'SELECT_VARIABLE';

export const selectVariable = (id: string): SelectVariable => ({
  type: SELECT_VARIABLE,
  payload: id,
});

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

interface RemoveVariable {
  type: 'REMOVE_VARIABLE';
  payload: string;
}

export const REMOVE_VARIABLE = 'REMOVE_VARIABLE';

export const removeVariable = (id: string): RemoveVariable => ({
  type: REMOVE_VARIABLE,
  payload: id,
});

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
  payload: { id: string; type: 'static' | 'function' };
}

export const UPDATE_VARIABLE_TYPE = 'UPDATE_VARIABLE_TYPE';

export const updateVariableType = (
  id: string,
  type: 'static' | 'function',
): UpdateVariableType => ({
  type: UPDATE_VARIABLE_TYPE,
  payload: { id, type },
});

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
export function updateStaticVariable(
  id: string,
  valueType: 'object',
  value: string,
): UpdateStaticVariable$Boolean;
export function updateStaticVariable(id: string, valueType: any, value: any): any {
  return {
    type: UPDATE_STATIC_VARIABLE,
    payload: {
      id,
      valueType,
      value,
    },
  };
}

interface UpdateFunctionVariable {
  type: 'UPDATE_FUNCTION_VARIABLE';
  payload: {
    id: string;
    functionId: string;
    valueType: 'string' | 'number' | 'boolean' | 'object';
    trigger: 'auto' | 'event';
    args: FunctionVariableArg[];
  };
}

export const UPDATE_FUNCTION_VARIABLE = 'UPDATE_FUNCTION_VARIABLE';

export const updateFunctionVariable = (
  id: string,
  functionId: string,
  valueType: 'string' | 'number' | 'boolean' | 'object',
  trigger: 'auto' | 'event',
  args: FunctionVariableArg[],
): UpdateFunctionVariable => ({
  type: UPDATE_FUNCTION_VARIABLE,
  payload: {
    id,
    functionId,
    valueType,
    trigger,
    args,
  },
});

export type Action$Variable =
  | SelectVariable
  | AddVariable
  | RemoveVariable
  | UpdateVariableName
  | UpdateVariableType
  | UpdateStaticVariable
  | UpdateFunctionVariable;
