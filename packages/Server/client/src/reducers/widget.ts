import {
  ADD_WIDGET,
  REMOVE_WIDGET,
  UPDATE_WIDGET_PROPS,
  UPDATE_WIDGET_STYLE,
  Action$Widget,
} from 'actions/widget';
import { REMOVE_LAYOUT, IRemoveLayout } from 'actions/layout';
import { UPDATE_ELEMENT_NAME, UPDATE_ELEMENT_CSS, IUpdateElementName, UpdateElementCSS } from 'actions/element';
import { Store$Widget } from 'types/store';

const initialState: Store$Widget = {};

export const widget = (
  state: Store$Widget = initialState,
  action: Action$Widget | IUpdateElementName | IRemoveLayout | UpdateElementCSS,
): Store$Widget => {
  switch (action.type) {
    case ADD_WIDGET: {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case REMOVE_WIDGET: {
      const { [action.payload]: removed, ...remaining } = state;
      return Object.keys(remaining).reduce((acc, cur) => {
        const current = remaining[cur];
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
    case REMOVE_LAYOUT: {
      return Object.keys(state).reduce((acc, cur) => {
        const current = state[cur];
        if (current.parent === action.payload) return acc;
        return {
          ...acc,
          [cur]: current,
        };
      }, {});
    }
    case UPDATE_WIDGET_PROPS: {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          props: {
            ...state[action.payload.id].props,
            [action.payload.key]: action.payload.prop,
          },
        },
      };
    }
    case UPDATE_WIDGET_STYLE: {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          style: action.payload.style,
        },
      };
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
    default:
      return state;
  }
};
