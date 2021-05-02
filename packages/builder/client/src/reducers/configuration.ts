import { INIT_FUNCTIONS, INIT_COMPONENTS, Action$Configuration } from 'actions/configuration';
import { Store$Configuration } from 'types/store';

const initialState: Store$Configuration = {
  functions: [],
  actions: [],
  components: [],
};

export const configuration = (
  state: Store$Configuration = initialState,
  action: Action$Configuration,
): Store$Configuration => {
  switch (action.type) {
    case INIT_COMPONENTS: {
      return {
        ...state,
        components: action.payload,
      };
    }
    case INIT_FUNCTIONS: {
      return {
        ...state,
        functions: action.payload.functions,
        actions: action.payload.actions,
      };
    }
    default:
      return state;
  }
};
