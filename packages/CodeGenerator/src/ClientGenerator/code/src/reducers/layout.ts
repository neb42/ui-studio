import { Store$Layout } from '../types/store';
import { UpdateTree, UPDATE_TREE } from '../actions/updateTree';

const initialState: Store$Layout = {
  config: {},
};

export const layout = (state: Store$Layout = initialState, action: UpdateTree): Store$Layout => {
  switch (action.type) {
    case UPDATE_TREE: {
      return {
        ...state,
        config: action.payload.layouts,
      };
    }
    default:
      return state;
  }
};
