import {
  ADD_WIDGET,
  REMOVE_WIDGET,
  UPDATE_WIDGET_PROPS,
  UPDATE_WIDGET_STYLE,
  Action$Widget,
} from 'actions/widget';
import { REMOVE_LAYOUT, IRemoveLayout } from 'actions/layout';
import { REMOVE_PAGE, RemovePage } from 'actions/page';
import { REMOVE_VARIABLE, RemoveVariable } from 'actions/variable';
import {
  UPDATE_ELEMENT_NAME,
  UPDATE_ELEMENT_CSS,
  UPDATE_ELEMENT_CLASS_NAMES,
  IUpdateElementName,
  UpdateElementCSS,
  UpdateElementClassNames,
} from 'actions/element';
import { Store$Widget } from 'types/store';

const initialState: Store$Widget = {};

export const widget = (
  state: Store$Widget = initialState,
  action:
    | Action$Widget
    | IUpdateElementName
    | IRemoveLayout
    | UpdateElementCSS
    | UpdateElementClassNames
    | RemovePage
    | RemoveVariable,
): Store$Widget => {
  switch (action.type) {
    case ADD_WIDGET: {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case REMOVE_LAYOUT:
    case REMOVE_WIDGET: {
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
        if (current.parent === action.payload.id) {
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
        return acc;
      }, {});
    }
    case REMOVE_VARIABLE: {
      return Object.keys(state).reduce((acc, cur) => {
        const current = state[cur];
        return {
          ...acc,
          [cur]: {
            ...current,
            props: Object.keys(current.props).reduce((a, c) => {
              const currentProp = current.props[c];
              if (currentProp.mode === 'variable' && currentProp.variableId === action.payload) {
                return {
                  mode: 'static',
                  type: 'string',
                  value: '',
                };
              }
              return { ...acc, [c]: currentProp };
            }, {}),
          },
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
