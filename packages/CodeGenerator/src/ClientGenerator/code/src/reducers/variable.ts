import { Store$Variable } from '../types/store';
import { 
  UpdateFunctionVariable$Pending,
  UpdateFunctionVariable$Fulfilled,
  UpdateFunctionVariable$Rejected,
  FUNCTION_API_CALL_PENDING,
  FUNCTION_API_CALL_FULFILLED,
  FUNCTION_API_CALL_REJECTED, 
} from '../actions/updateFunctionVariable';
import { UpdateStaticVariable, UPDATE_STATIC_VARIABLE } from '../actions/updateStaticVariable';
import { UpdateTree, UPDATE_TREE } from '../actions/updateTree';

type Action$Variable = 
  | UpdateFunctionVariable$Pending
  | UpdateFunctionVariable$Fulfilled
  | UpdateFunctionVariable$Rejected
  | UpdateStaticVariable
  | UpdateTree;

const initialState: Store$Variable = {
  config: {},
  value: {},
};

export const variable = (state: Store$Variable = initialState, action: Action$Variable) => {
  switch (action.type) {
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
        results: {
          ...state.config,
          [action.payload.id]: {
            ...state.config[action.payload.id],
            value: action.payload,
            loading: false,
            error: false,
          },
        },
      };
    }
    case FUNCTION_API_CALL_REJECTED: {
      return {
        ...state,
        results: {
          ...state.config,
          [action.payload.id]: {
            ...state.config[action.payload.id],
            loading: false,
            error: true,
          },
        },
      };
    }
    case UPDATE_STATIC_VARIABLE: {
      return {
        ...state,
        results: {
          ...state.config,
          [action.payload.id]: action.payload.value,
        },
     }; 
    }
    case UPDATE_TREE: {
      const { variables: config } = action.payload;
      const value = Object.keys(config).reduce((acc, cur) => {
        if (JSON.stringify(config[cur]) !== JSON.stringify(state.config[cur])) {
          // TODO
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