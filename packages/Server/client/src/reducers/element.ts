import {
  SELECT_PAGE,
  SELECT_ELEMENT,
  UPDATE_ELEMENT_NAME,
  INIT_FUNCTIONS,
  INIT_COMPONENTS,
  Action$Element,
} from 'actions/element';
import { Store$Element } from 'types/store';

const initialState: Store$Element = {
  selectedPage: null,
  selectedOverlay: null,
  selectedElement: null,
  functions: [],
  components: [],
};

export const element = (
  state: Store$Element = initialState,
  action: Action$Element,
): Store$Element => {
  switch (action.type) {
    case SELECT_PAGE: {
      return {
        ...state,
        selectedPage: action.payload,
      };
    }
    case SELECT_ELEMENT: {
      return {
        ...state,
        selectedElement: action.payload,
      };
    }
    case INIT_FUNCTIONS: {
      return {
        ...state,
        functions: action.payload,
      };
    }
    case INIT_COMPONENTS: {
      return {
        ...state,
        components: action.payload,
      };
    }
    default:
      return state;
  }
};
