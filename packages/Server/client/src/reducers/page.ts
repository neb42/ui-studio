import { UPDATE_ELEMENT_NAME, IUpdateElementName } from 'actions/element';
import { Store$Page } from 'types/store';

const initialState: Store$Page = {
  Page1: { id: '', type: 'page', name: 'Page1', props: {} },
};

export const page = (state: Store$Page = initialState, action: IUpdateElementName): Store$Page => {
  switch (action.type) {
    case UPDATE_ELEMENT_NAME: {
      return Object.keys(state).reduce(
        (acc, cur) => {
          if (cur === action.payload.id) return acc;
          return { ...acc, [cur]: state[cur] };
        },
        action.payload.type === 'page'
          ? {
              [action.payload.name]: {
                ...state[action.payload.id],
                name: action.payload.name,
              },
            }
          : {},
      );
    }
    default:
      return state;
  }
};
