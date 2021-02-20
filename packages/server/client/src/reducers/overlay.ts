import {
  UPDATE_ELEMENT_NAME,
  UPDATE_ELEMENT_CSS,
  UPDATE_ELEMENT_CLASS_NAMES,
  IUpdateElementName,
  UpdateElementCSS,
  UpdateElementClassNames,
} from 'actions/element';
import { Store$Overlay } from 'types/store';

const initialState: Store$Overlay = {};

export const overlay = (
  state: Store$Overlay = initialState,
  action: IUpdateElementName | UpdateElementCSS | UpdateElementClassNames,
): Store$Overlay => {
  switch (action.type) {
    case UPDATE_ELEMENT_NAME: {
      return Object.keys(state).reduce(
        (acc, cur) => {
          if (cur === action.payload.id) return acc;
          return { ...acc, [cur]: state[cur] };
        },
        action.payload.type === 'page'
          ? {
              [action.payload.name]: {
                ...state[action.payload.id],
                name: action.payload.name,
              },
            }
          : {},
      );
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
    default:
      return state;
  }
};
