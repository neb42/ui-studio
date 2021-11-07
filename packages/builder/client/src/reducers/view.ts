import {
  SELECT_ROOT_ELEMENT,
  SELECT_ELEMENT,
  HOVER_ELEMENT,
  SELECT_VIEW,
  UPDATE_PREVIEW_SIZE,
  SELECT_VARIABLE,
  SET_PREVIEW_SERVER,
  SET_PREVIEW_READY,
  Action$View,
} from 'actions/view';
import { OPEN_MODAL, CLOSE_MODAL, OpenModal, CloseModal } from 'actions/modal';
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
    ready: false,
    host: 'http://localhost',
    port: 3000,
    size: 'monitor',
  },
  selectedView: 'preview',
  modal: {
    functionConfiguration: {
      open: false,
      type: null,
      id: null,
      path: null,
      method: null,
    },
  },
};

export const view = (
  state: Store$View = initialState,
  action: Action$View | OpenModal<keyof Store$View['modal']> | CloseModal | InitClient,
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
          ...state.preview,
          size: action.payload.previewSize,
        },
      };
    }
    case SET_PREVIEW_SERVER: {
      return {
        ...state,
        preview: {
          ...state.preview,
          host: action.payload.host,
          port: action.payload.port,
        },
      };
    }
    case SET_PREVIEW_READY: {
      return {
        ...state,
        preview: {
          ...state.preview,
          ready: action.payload,
        },
      };
    }
    case OPEN_MODAL: {
      return {
        ...state,
        modal: {
          ...initialState.modal,
          [action.payload.key]: {
            open: true,
            ...action.payload.data,
          },
        },
      };
    }
    case CLOSE_MODAL: {
      return {
        ...state,
        modal: initialState.modal,
      };
    }
    case INIT_CLIENT: {
      const rootIds = Object.keys(action.payload.tree);
      if (state.tree.rootId && rootIds.includes(state.tree.rootId)) {
        return state;
      }
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
