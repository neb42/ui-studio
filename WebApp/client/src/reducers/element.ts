import { ADD_WIDGET, ADD_LAYOUT, Action$Element } from 'actions/element';
import { Store$Element } from 'types/store';

const initialState: Store$Element = {
  pages: {},
  widgets: {},
  layouts: {},
};

const element = (state: Store$Element = initialState, action: Action$Element) => {
  switch (action.type) {
    case ADD_WIDGET: {
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [action.payload.name]: action.payload,
        },
      };
    }
    case ADD_LAYOUT: {
      return {
        ...state,
        layouts: {
          ...state.layouts,
          [action.payload.name]: action.payload,
        },
      };
    }
    default:
      return state;
  }
};

export default element;
