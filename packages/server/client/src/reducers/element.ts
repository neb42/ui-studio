import {
  SELECT_PAGE,
  SELECT_ELEMENT,
  HOVER_ELEMENT,
  SELECT_VIEW,
  INIT_FUNCTIONS,
  INIT_COMPONENTS,
  INIT_CLIENT,
  UPDATE_PREVIEW_SIZE,
  Action$Element,
} from 'actions/element';
import { SELECT_VARIABLE, SelectVariable } from 'actions/variable';
import { Store$Element } from 'types/store';

const initialState: Store$Element = {
  selectedPage: null,
  selectedOverlay: null,
  selectedElement: null,
  hoverElement: null,
  selectedVariable: null,
  selectedView: 'preview',
  previewSize: 'monitor',
  functions: [],
  actions: [],
  components: [],
};

export const element = (
  state: Store$Element = initialState,
  action: Action$Element | SelectVariable,
): Store$Element => {
  switch (action.type) {
    case SELECT_PAGE: {
      return {
        ...state,
        selectedPage: action.payload,
        selectedElement: action.payload,
      };
    }
    case SELECT_ELEMENT: {
      return {
        ...state,
        selectedElement: action.payload,
      };
    }
    case HOVER_ELEMENT: {
      return {
        ...state,
        hoverElement: action.payload,
      };
    }
    case SELECT_VARIABLE: {
      return {
        ...state,
        selectedVariable: action.payload,
      };
    }
    case SELECT_VIEW: {
      return {
        ...state,
        selectedView: action.payload,
      };
    }
    case INIT_FUNCTIONS: {
      return {
        ...state,
        functions: action.payload.functions,
        actions: action.payload.actions,
      };
    }
    case INIT_COMPONENTS: {
      return {
        ...state,
        components: action.payload,
      };
    }
    case INIT_CLIENT: {
      return {
        ...state,
        selectedPage: Object.values(action.payload.pages)[0].id,
        selectedElement: Object.values(action.payload.pages)[0].id,
      };
    }
    case UPDATE_PREVIEW_SIZE: {
      return {
        ...state,
        previewSize: action.payload.previewSize,
      };
    }
    default:
      return state;
  }
};
