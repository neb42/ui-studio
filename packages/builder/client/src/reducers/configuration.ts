import { INIT_FUNCTIONS, INIT_COMPONENTS, Action$Configuration } from 'actions/configuration';
import { INIT_CLIENT } from 'actions/init';
import { Store$Configuration } from 'types/store';

const initialState: Store$Configuration = {
  functions: [],
  actions: [],
  components: [],
  colors: null,
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
        functions: action.payload?.functions ?? [],
        actions: action.payload?.actions ?? [],
      };
    }
    case INIT_CLIENT: {
      return {
        ...state,
        colors: action.payload.colors,
      };
    }
    default:
      return state;
  }
};
