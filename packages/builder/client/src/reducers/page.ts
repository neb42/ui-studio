import {
  UPDATE_ELEMENT_NAME,
  UPDATE_ELEMENT_CSS,
  UPDATE_ELEMENT_CLASS_NAMES,
  INIT_CLIENT,
  IUpdateElementName,
  UpdateElementCSS,
  UpdateElementClassNames,
  InitClient,
} from 'actions/element';
import { ADD_PAGE, REMOVE_PAGE, Action$Page } from 'actions/page';
import { Store$Page } from 'types/store';

const initialState: Store$Page = {};

export const page = (
  state: Store$Page = initialState,
  action:
    | Action$Page
    | IUpdateElementName
    | UpdateElementCSS
    | UpdateElementClassNames
    | InitClient,
): Store$Page => {
  switch (action.type) {
    case ADD_PAGE: {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case REMOVE_PAGE: {
      const { [action.payload]: _, ...remaining } = state;
      return remaining;
    }
    case UPDATE_ELEMENT_NAME: {
      if (Object.keys(state).includes(action.payload.id)) {
        return {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            name: action.payload.name,
          },
        };
      }
      return state;
    }
    case UPDATE_ELEMENT_CSS: {
      if (Object.keys(state).includes(action.payload.id)) {
        return {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            style: {
              ...state[action.payload.id].style,
              css: action.payload.css,
            },
          },
        };
      }
      return state;
    }
    case UPDATE_ELEMENT_CLASS_NAMES: {
      if (Object.keys(state).includes(action.payload.id)) {
        return {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            style: {
              ...state[action.payload.id].style,
              classNames: action.payload.classNames,
            },
          },
        };
      }
      return state;
    }
    case INIT_CLIENT: {
      return action.payload.pages;
    }
    default:
      return state;
  }
};