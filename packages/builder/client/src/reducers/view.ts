import {
  SELECT_ROOT_ELEMENT,
  SELECT_ELEMENT,
  HOVER_ELEMENT,
  SELECT_VIEW,
  UPDATE_PREVIEW_SIZE,
  SELECT_VARIABLE,
  Action$View,
} from 'actions/view';
import { INIT_CLIENT, InitClient } from 'actions/init';
import { Store$View } from 'types/store';

const initialState: Store$View = {
  tree: {
    rootId: null,
    selectedElementId: null,
    hoverElementId: null,
  },
  variable: {
    selectedVariableId: null,
  },
  preview: {
    size: 'monitor',
  },
  selectedView: 'preview',
};

export const view = (
  state: Store$View = initialState,
  action: Action$View | InitClient,
): Store$View => {
  switch (action.type) {
    case SELECT_ROOT_ELEMENT: {
      const { id } = action.payload;
      return {
        ...state,
        tree: {
          ...state.tree,
          rootId: id,
          selectedElementId: id,
          hoverElementId: null,
        },
      };
    }
    case SELECT_ELEMENT: {
      return {
        ...state,
        tree: {
          ...state.tree,
          selectedElementId: action.payload,
        },
      };
    }
    case HOVER_ELEMENT: {
      return {
        ...state,
        tree: {
          ...state.tree,
          hoverElementId: action.payload,
        },
      };
    }
    case SELECT_VARIABLE: {
      return {
        ...state,
        variable: {
          ...state.variable,
          selectedVariableId: action.payload,
        },
      };
    }
    case SELECT_VIEW: {
      return {
        ...state,
        selectedView: action.payload,
      };
    }
    case UPDATE_PREVIEW_SIZE: {
      return {
        ...state,
        preview: {
          size: action.payload.previewSize,
        },
      };
    }
    case INIT_CLIENT: {
      return {
        ...state,
        tree: {
          ...state.tree,
          rootId: Object.keys(action.payload.tree)[0],
          selectedElementId: Object.keys(action.payload.tree)[0],
        },
      };
    }
    default:
      return state;
  }
};
