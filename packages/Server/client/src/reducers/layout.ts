import {
  ADD_LAYOUT,
  REMOVE_LAYOUT,
  UPDATE_LAYOUT_CONFIG,
  UPDATE_LAYOUT_STYLE,
  Action$Layout,
} from 'actions/layout';
import { UPDATE_ELEMENT_NAME, UPDATE_ELEMENT_CSS, IUpdateElementName, UpdateElementCSS } from 'actions/element';
import { Store$Layout } from 'types/store';

const initialState: Store$Layout = {};

export const layout = (
  state: Store$Layout = initialState,
  action: Action$Layout | IUpdateElementName | UpdateElementCSS,
): Store$Layout => {
  switch (action.type) {
    case ADD_LAYOUT: {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case REMOVE_LAYOUT: {
      const { [action.payload]: removed, ...remaining } = state;
      return Object.keys(remaining).reduce((acc, cur) => {
        const current = remaining[cur];
        if (current.parent === removed.id) return acc;
        return {
          ...acc,
          [cur]: {
            ...current,
            position:
              current.parent === removed.parent && current.position > removed.position
                ? current.position - 1
                : current.position,
          },
        };
      }, {});
    }
    case UPDATE_LAYOUT_CONFIG: {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          props: {
            ...state[action.payload.id].props,
            [action.payload.key]: action.payload.value,
          },
        },
      };
    }
    case UPDATE_LAYOUT_STYLE: {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          style: action.payload.style,
        },
      };
    }
    case UPDATE_ELEMENT_NAME: {
      return Object.keys(state).reduce(
        (acc, cur) => {
          if (cur === action.payload.id) return acc;
          return { ...acc, [cur]: state[cur] };
        },
        action.payload.type === 'overlay'
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
    default:
      return state;
  }
};
