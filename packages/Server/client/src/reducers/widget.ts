import {
  ADD_WIDGET,
  REMOVE_WIDGET,
  UPDATE_WIDGET_PROPS,
  UPDATE_WIDGET_STYLE,
  Action$Widget,
} from 'actions/widget';
import { UPDATE_ELEMENT_NAME, IUpdateElementName } from 'actions/element';
import { Store$Widget } from 'types/store';

const initialState: Store$Widget = {};

export const widget = (
  state: Store$Widget = initialState,
  action: Action$Widget | IUpdateElementName,
): Store$Widget => {
  switch (action.type) {
    case ADD_WIDGET: {
      return {
        ...state,
        [action.payload.name]: action.payload,
      };
    }
    case REMOVE_WIDGET: {
      const { [action.payload]: _, ...remaining } = state;
      return remaining;
    }
    case UPDATE_WIDGET_PROPS: {
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
    case UPDATE_WIDGET_STYLE: {
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
        action.payload.type === 'widget'
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
