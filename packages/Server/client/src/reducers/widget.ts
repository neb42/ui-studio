import {
  ADD_WIDGET,
  REMOVE_WIDGET,
  UPDATE_WIDGET_PROPS,
  UPDATE_WIDGET_STYLE,
  ADD_WIDGET_EVENT,
  UPDATE_WIDGET_EVENT,
  REMOVE_WIDGET_EVENT,
  Action$Widget,
} from 'actions/widget';
import { REMOVE_LAYOUT, IRemoveLayout } from 'actions/layout';
import { REMOVE_PAGE, RemovePage } from 'actions/page';
import { REMOVE_VARIABLE, RemoveVariable } from 'actions/variable';
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
    | UpdateElementPosition
    | RemovePage
    | RemoveVariable
    | InitClient,
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
    case ADD_WIDGET_EVENT: {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          events: {
            ...state[action.payload.id].events,
            [action.payload.eventKey]: [
              ...state[action.payload.id].events[action.payload.eventKey],
              action.payload.event,
            ],
          },
        },
      };
    }
    case UPDATE_WIDGET_EVENT: {
      const events = state[action.payload.id].events[action.payload.eventKey];
      events[action.payload.index] = action.payload.event;
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          events: {
            ...state[action.payload.id].events,
            [action.payload.eventKey]: events,
          },
        },
      };
    }
    case REMOVE_WIDGET_EVENT: {
      const events = state[action.payload.id].events[action.payload.eventKey];
      events.splice(action.payload.index, 1);
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          events: {
            ...state[action.payload.id].events,
            [action.payload.eventKey]: events,
          },
        },
      };
    }
    case UPDATE_ELEMENT_POSITION: {
      return Object.keys(state).reduce((acc, cur) => {
        const current = state[cur];
        // The element being moved
        if (current.id === action.payload.elementId) {
          return {
            ...acc,
            [cur]: {
              ...current,
              parent: action.payload.destination.parentId,
              position: action.payload.destination.position,
            },
          };
        }
        // The element is being moved within it's current parent element
        if (action.payload.destination.parentId === action.payload.source.parentId) {
          if (current.parent === action.payload.destination.parentId) {
            const position = (() => {
              let p = current.position;
              if (p > action.payload.source.position) p -= 1;
              if (p >= action.payload.destination.position) p += 1;
              return p;
            })();
            return {
              ...acc,
              [cur]: {
                ...current,
                position,
              },
            };
          }
        }
        // The element has been moved into this element's parent
        if (current.parent === action.payload.destination.parentId) {
          return {
            ...acc,
            [cur]: {
              ...current,
              position:
                current.position >= action.payload.destination.position
                  ? current.position + 1
                  : current.position,
            },
          };
        }
        // The element has been moved out of this element's parent
        if (current.parent === action.payload.source.parentId) {
          return {
            ...acc,
            [cur]: {
              ...current,
              position:
                current.position > action.payload.source.position
                  ? current.position - 1
                  : current.position,
            },
          };
        }
        return {
          ...acc,
          [cur]: current,
        };
      }, {});
    }
    case INIT_CLIENT: {
      return action.payload.widgets;
    }
    default:
      return state;
  }
};
