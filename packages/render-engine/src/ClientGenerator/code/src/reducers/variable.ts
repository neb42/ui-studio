import { Store$Variable } from '../types/store';
import {
  UpdateFunctionVariable$Pending,
  UpdateFunctionVariable$Fulfilled,
  UpdateFunctionVariable$Rejected,
  FUNCTION_API_CALL_PENDING,
  FUNCTION_API_CALL_FULFILLED,
  FUNCTION_API_CALL_REJECTED,
} from '../actions/updateFunctionVariable';
import { InitApi, INIT_API } from '../actions/initApi';
import { UpdateStaticVariable, UPDATE_STATIC_VARIABLE } from '../actions/updateStaticVariable';
import { UpdateTree, UPDATE_TREE } from '../actions/updateTree';

type Action$Variable =
  | UpdateFunctionVariable$Pending
  | UpdateFunctionVariable$Fulfilled
  | UpdateFunctionVariable$Rejected
  | UpdateStaticVariable
  | UpdateTree
  | InitApi;

const initialState: Store$Variable = {
  openAPISchema: {
    openapi: '3.0.2',
    info: { title: '', version: '0.0.0' },
    paths: {},
  },
  config: {},
  value: {},
};

export const variable = (
  state: Store$Variable = initialState,
  action: Action$Variable,
): Store$Variable => {
  switch (action.type) {
    case INIT_API: {
      return {
        ...state,
        openAPISchema: action.payload,
      };
    }
    case FUNCTION_API_CALL_PENDING: {
      return {
        ...state,
        value: {
          ...state.value,
          [action.payload.id]: {
            ...state.value[action.payload.id],
            loading: true,
            error: false,
          },
        },
      };
    }
    case FUNCTION_API_CALL_FULFILLED: {
      return {
        ...state,
        value: {
          ...state.value,
          [action.payload.id]: {
            ...state.value[action.payload.id],
            value: action.payload.data,
            loading: false,
            error: false,
          },
        },
      };
    }
    case FUNCTION_API_CALL_REJECTED: {
      return {
        ...state,
        value: {
          ...state.value,
          [action.payload.id]: {
            ...state.value[action.payload.id],
            loading: false,
            error: true,
          },
        },
      };
    }
    case UPDATE_STATIC_VARIABLE: {
      return {
        ...state,
        value: {
          ...state.value,
          [action.payload.id]: action.payload.value,
        },
      };
    }
    case UPDATE_TREE: {
      const { variables: config } = action.payload;
      const value = Object.keys(config).reduce((acc, cur) => {
        const newConfig = config[cur];
        if (JSON.stringify(newConfig) !== JSON.stringify(state.config[cur])) {
          if (newConfig.type === 'static') {
            return { ...acc, [cur]: newConfig.value };
          }
          if (newConfig.type === 'function') {
            return {
              ...acc,
              [cur]: {
                value: null,
                loading: false,
                error: false,
              },
            };
          }
          return { ...acc, [cur]: state.value[cur] };
        }
        return { ...acc, [cur]: state.value[cur] };
      }, {});
      return { ...state, config, value };
    }
    default:
      return state;
  }
};
