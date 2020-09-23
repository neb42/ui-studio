import { SELECT_ELEMENT, Action$Element } from 'actions/element';
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
    default:
      return state;
  }
};
