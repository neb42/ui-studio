import { Variable, StaticVariable, FunctionVariable } from '@ui-builder/types';
import {
  Action$Variable,
  ADD_VARIABLE,
  REMOVE_VARIABLE,
  UPDATE_VARIABLE_NAME,
  UPDATE_VARIABLE_TYPE,
  UPDATE_STATIC_VARIABLE,
  UPDATE_FUNCTION_VARIABLE,
} from 'actions/variable';
import { Store$Variable } from 'types/store';

const initialState: Store$Variable = {};

export const variable = (
  state: Store$Variable = initialState,
  action: Action$Variable,
): Store$Variable => {
  switch (action.type) {
    case ADD_VARIABLE: {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case REMOVE_VARIABLE: {
      const { [action.payload]: _, ...remaining } = state;
      return remaining;
    }
    case UPDATE_VARIABLE_NAME: {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          name: action.payload.name,
        },
      };
    }
    case UPDATE_VARIABLE_TYPE: {
      const defaultVariable: Variable = (() => {
        if (action.payload.type === 'static') {
          return {
            id: action.payload.id,
            name: state[action.payload.id].name,
            type: 'static',
            valueType: 'string',
            value: '',
          } as StaticVariable;
        }
        if (action.payload.type === 'function') {
          return {
            id: action.payload.id,
            name: state[action.payload.id].name,
            type: 'function',
            functionId: '',
            valueType: 'string',
            trigger: 'auto',
            args: [],
          } as FunctionVariable;
        }
        throw Error('Invalid variable type');
      })();
      return {
        ...state,
        [action.payload.id]: defaultVariable,
      };
    }
    case UPDATE_STATIC_VARIABLE: {
      const v = state[action.payload.id];
      if (v.type !== 'static')
        throw Error('Trying to update non-static variable as static variable');

      return {
        ...state,
        [v.id]: {
          ...v,
          ...action.payload,
        } as StaticVariable,
      };
    }
    case UPDATE_FUNCTION_VARIABLE: {
      const v = state[action.payload.id];
      if (v.type !== 'function')
        throw Error('Trying to update non-function variable as function variable');

      return {
        ...state,
        [v.id]: {
          ...v,
          ...action.payload,
        } as FunctionVariable,
      };
    }
    default:
      return state;
  }
};