import { SELECT_ELEMENT, UPDATE_ELEMENT_NAME, Action$Element } from 'actions/element';
import { Store$Element } from 'types/store';

const initialState: Store$Element = {
  selectedElement: null,
};

export const element = (
  state: Store$Element = initialState,
  action: Action$Element,
): Store$Element => {
  switch (action.type) {
    case SELECT_ELEMENT: {
      return {
        ...state,
        selectedElement: action.payload,
      };
    }
    case UPDATE_ELEMENT_NAME: {
      if (state.selectedElement === action.payload.id) {
        return {
          ...state,
          selectedElement: action.payload.name,
        };
      }
      return state;
    }
    default:
      return state;
  }
};
