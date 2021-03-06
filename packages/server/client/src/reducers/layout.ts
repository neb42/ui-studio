import { Layout } from 'canvas-types';
import {
  ADD_LAYOUT,
  REMOVE_LAYOUT,
  UPDATE_LAYOUT_CONFIG,
  UPDATE_LAYOUT_STYLE,
  UPDATE_LAYOUT_PARENT,
  Action$Layout,
} from 'actions/layout';
import {
  UPDATE_ELEMENT_NAME,
  UPDATE_ELEMENT_CSS,
  UPDATE_ELEMENT_CLASS_NAMES,
  UPDATE_ELEMENT_POSITION,
  INIT_CLIENT,
  IUpdateElementName,
  UpdateElementCSS,
  UpdateElementClassNames,
  UpdateElementPosition,
  InitClient,
} from 'actions/element';
import { REMOVE_PAGE, RemovePage } from 'actions/page';
import { REMOVE_WIDGET, IRemoveWidget } from 'actions/widget';
import { Store$Layout } from 'types/store';
import { ElementModel } from 'models/element';

const initialState: Store$Layout = {};

export const layout = (
  state: Store$Layout = initialState,
  action:
    | Action$Layout
    | IUpdateElementName
    | UpdateElementCSS
    | UpdateElementClassNames
    | UpdateElementPosition
    | RemovePage
    | IRemoveWidget
    | InitClient,
): Store$Layout => {
  switch (action.type) {
    case ADD_LAYOUT: {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case REMOVE_WIDGET:
    case REMOVE_LAYOUT: {
      return Object.keys(state).reduce((acc, cur) => {
        const current = state[cur];
        if (current.id === action.payload.id) {
          if (action.payload.delete) return acc;
          return {
            ...acc,
            [cur]: {
              ...current,
              position: null,
              parent: null,
            },
          };
        }
        return {
          ...acc,
          [cur]: {
            ...current,
            position:
              current.parent === action.payload.parent && current.position > action.payload.position
                ? current.position - 1
                : current.position,
          },
        };
      }, {});
    }
    case REMOVE_PAGE: {
      return Object.keys(state).reduce((acc, cur) => {
        const current = state[cur];
        if (current.parent === action.payload) {
          return {
            ...acc,
            [cur]: {
              ...current,
              position: null,
              parent: null,
            },
          };
        }
        return { ...acc, [cur]: current };
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
    case UPDATE_ELEMENT_POSITION: {
      return Object.keys(state).reduce((acc, cur) => {
        const element = ElementModel.updateElementPosition<Layout>(
          state[cur],
          action.payload.elementId,
          action.payload.source,
          action.payload.destination,
          action.payload.style,
        );
        return {
          ...acc,
          [cur]: element,
        };
      }, {});
    }
    case UPDATE_LAYOUT_PARENT: {
      return {
        ...state,
        [action.payload.layoutId]: {
          ...state[action.payload.layoutId],
          parent: action.payload.parentId,
          position: action.payload.position,
        },
      };
    }
    case INIT_CLIENT: {
      return action.payload.layouts;
    }
    default:
      return state;
  }
};
