import { Store$Root } from '../types/store';
import { UpdateTree, UPDATE_TREE } from '../actions/updateTree';

const initialState: Store$Root = {
  config: {},
};

export const root = (state: Store$Root = initialState, action: UpdateTree): Store$Root => {
  switch (action.type) {
    case UPDATE_TREE: {
      return {
        config: Object.values(action.payload.tree).reduce((acc, cur) => {
          return {
            ...acc,
            [cur.root.id]: cur.root,
          };
        }, {}),
      };
    }
    default:
      return state;
  }
};
