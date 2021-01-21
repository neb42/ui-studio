import { v4 as uuidv4 } from 'uuid';
import {
  UPDATE_ELEMENT_NAME,
  UPDATE_ELEMENT_CSS,
  UPDATE_ELEMENT_CLASS_NAMES,
  IUpdateElementName,
  UpdateElementCSS,
  UpdateElementClassNames,
} from 'actions/element';
import { Store$Page } from 'types/store';

const ids = [uuidv4(), uuidv4(), uuidv4()];

const initialState: Store$Page = {
  [ids[0]]: {
    id: ids[0],
    type: 'page',
    name: 'Page1',
    props: {},
    style: { css: '', classNames: '' },
  },
  [ids[1]]: {
    id: ids[1],
    type: 'page',
    name: 'Page2',
    props: {},
    style: { css: '', classNames: '' },
  },
  [ids[2]]: {
    id: ids[2],
    type: 'page',
    name: 'Page3',
    props: {},
    style: { css: '', classNames: '' },
  },
};

export const page = (
  state: Store$Page = initialState,
  action: IUpdateElementName | UpdateElementCSS | UpdateElementClassNames,
): Store$Page => {
  switch (action.type) {
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
