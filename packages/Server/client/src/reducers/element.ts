import {
  SELECT_PAGE,
  SELECT_ELEMENT,
  INIT_FUNCTIONS,
  INIT_COMPONENTS,
  Action$Element,
} from 'actions/element';
import { SELECT_VARIABLE, SelectVariable } from 'actions/variable';
import { Store$Element } from 'types/store';

const initialState: Store$Element = {
  selectedPage: null,
  selectedOverlay: null,
  selectedElement: null,
  selectedVariable: null,
  functions: [],
  components: [],
};

export const element = (
  state: Store$Element = initialState,
  action: Action$Element | SelectVariable,
): Store$Element => {
  switch (action.type) {
    case SELECT_PAGE: {
      return {
        ...state,
        selectedPage: action.payload,
        selectedElement: action.payload,
      };
    }
    case SELECT_ELEMENT: {
      return {
        ...state,
        selectedElement: action.payload,
      };
    }
    case SELECT_VARIABLE: {
      return {
        ...state,
        selectedVariable: action.payload,
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
