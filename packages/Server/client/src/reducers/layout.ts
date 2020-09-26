import {
  ADD_LAYOUT,
  REMOVE_LAYOUT,
  UPDATE_LAYOUT_CONFIG,
  UPDATE_LAYOUT_STYLE,
  Action$Layout,
} from 'actions/layout';
import { UPDATE_ELEMENT_NAME, IUpdateElementName } from 'actions/element';
import { Store$Layout } from 'types/store';

const initialState: Store$Layout = {};

export const layout = (
  state: Store$Layout = initialState,
  action: Action$Layout | IUpdateElementName,
): Store$Layout => {
  switch (action.type) {
    case ADD_LAYOUT: {
      return {
        ...state,
        [action.payload.name]: action.payload,
      };
    }
    case REMOVE_LAYOUT: {
      const { [action.payload]: removed, ...remaining } = state;
      return Object.keys(remaining).reduce((acc, cur) => {
        const current = remaining[cur];
        if (current.parent === removed.name) return acc;
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
        [action.payload.name]: {
          ...state[action.payload.name],
          props: {
            ...state[action.payload.name].props,
            [action.payload.key]: action.payload.value,
          },
        },
      };
    }
    case UPDATE_LAYOUT_STYLE: {
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          style: action.payload.style,
        },
      };
    }
    case UPDATE_ELEMENT_NAME: {
      return Object.keys(state).reduce(
        (acc, cur) => {
          if (cur === action.payload.id) return acc;
          if (state[cur].parent === action.payload.id) {
            return {
              ...acc,
              [cur]: {
                ...state[cur],
                parent: action.payload.name,
              },
            };
          }
          return { ...acc, [cur]: state[cur] };
        },
        action.payload.type === 'layout'
          ? {
              [action.payload.name]: {
                ...state[action.payload.id],
                name: action.payload.name,
              },
            }
          : {},
      );
    }
    default:
      return state;
  }
};
