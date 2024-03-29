import { StaticVariable, FunctionVariable } from '@ui-studio/types';
import {
  Action$Variable,
  ADD_VARIABLE,
  REMOVE_VARIABLE,
  UPDATE_VARIABLE_NAME,
  UPDATE_VARIABLE_TYPE,
  UPDATE_STATIC_VARIABLE,
  UPDATE_FUNCTION_VARIABLE,
  UPDATE_VARIABLE_FUNCTION_ARG,
  UPDATE_LOOKUP_VARIABLE,
} from 'actions/variable';
import { INIT_CLIENT, InitClient } from 'actions/init';
import { Store$Variable } from 'types/store';
import { VariableModel } from 'models/variable';

const initialState: Store$Variable = {};

export const variableReducer = (
  state: Store$Variable = initialState,
  action: Action$Variable | InitClient,
): Store$Variable => {
  switch (action.type) {
    case ADD_VARIABLE: {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case REMOVE_VARIABLE: {
      return Object.keys(state).reduce((acc, cur) => {
        if (cur === action.payload) return acc;
        return {
          ...acc,
          [cur]: state[cur],
        };
      }, {});
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
      const { id, type, openAPISchema } = action.payload;
      return {
        ...state,
        [id]: VariableModel.updateVariableType(state[id], type, openAPISchema, state),
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

    case UPDATE_LOOKUP_VARIABLE: {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }

    case UPDATE_VARIABLE_FUNCTION_ARG: {
      const { variableId, argType, argKey, arg } = action.payload;

      const variable = state[variableId];
      if (variable.type !== 'function') throw new Error();

      return {
        ...state,
        [variableId]: {
          ...variable,
          args: {
            ...variable.args,
            [argType]: {
              ...variable.args[argType],
              [argKey]: arg,
            },
          },
        },
      };
    }

    case INIT_CLIENT: {
      return action.payload.variables;
    }
    default:
      return state;
  }
};
