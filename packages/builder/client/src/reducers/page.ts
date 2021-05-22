import { INIT_CLIENT } from 'actions/init';
import { UPDATE_PAGE_NAME } from 'actions/name';
import { UPDATE_PAGE_STYLE } from 'actions/styles';
import { ADD_PAGE, REMOVE_PAGE, Action$Page } from 'actions/page';
import { Store$Page } from 'types/store';

const initialState: Store$Page = {};

export const pageReducer = (state: Store$Page = initialState, action: Action$Page): Store$Page => {
  switch (action.type) {
    case ADD_PAGE: {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case REMOVE_PAGE: {
      const { [action.payload]: _, ...remaining } = state;
      return remaining;
    }
    case UPDATE_PAGE_NAME: {
      const { rootId, name } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          name,
        },
      };
    }
    case UPDATE_PAGE_STYLE: {
      const { rootId, style } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          style,
        },
      };
    }

    case INIT_CLIENT: {
      const { tree } = action.payload;
      return Object.keys(tree).reduce((acc, cur) => {
        const { root } = tree[cur];
        if (root.type === 'page') {
          return {
            ...acc,
            [cur]: root,
          };
        }
        return acc;
      }, {});
    }
    default:
      return state;
  }
};
