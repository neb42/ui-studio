import { Store$Development } from '../types/store';
import {
  UpdateHoverElement,
  UPDATE_HOVER_ELEMENT,
  UpdateSelectedElement,
  UPDATE_SELECTED_ELEMENT,
} from '../actions/development';

const initialState: Store$Development = {
  selectedElement: null,
  hoverElement: null,
};

export const development = (
  state: Store$Development = initialState,
  action: UpdateHoverElement | UpdateSelectedElement,
): Store$Development => {
  switch (action.type) {
    case UPDATE_HOVER_ELEMENT: {
      return {
        ...state,
        hoverElement: action.payload.id,
      };
    }
    case UPDATE_SELECTED_ELEMENT: {
      return {
        ...state,
        selectedElement: action.payload.id,
      };
    }
    default:
      return state;
  }
};
