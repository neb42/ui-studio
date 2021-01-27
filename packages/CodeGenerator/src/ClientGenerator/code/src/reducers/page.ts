import { Store$Page } from '../types/store';
import { UpdateTree, UPDATE_TREE } from '../actions/updateTree';

const initialState: Store$Page = {
  config: {},
};

export const page = (state: Store$Page = initialState, action: UpdateTree) => {
  switch (action.type) {
    case UPDATE_TREE: {
      return {
        ...state,
        config: action.payload.pages,
      };
    }
    default:
      return state;
  }
};