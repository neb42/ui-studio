import { UPDATE_ELEMENT_NAME, IUpdateElementName } from 'actions/element';
import { Store$Overlay } from 'types/store';

const initialState: Store$Overlay = {};

export const overlay = (
  state: Store$Overlay = initialState,
  action: IUpdateElementName,
): Store$Overlay => {
  switch (action.type) {
    case UPDATE_ELEMENT_NAME: {
      return Object.keys(state).reduce(
        (acc, cur) => {
          if (cur === action.payload.id) return acc;
          return { ...acc, [cur]: state[cur] };
        },
        action.payload.type === 'overlay'
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
