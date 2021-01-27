import { Store$Widget } from '../types/store';
import { UpdateWidget, UPDATE_WIDGET } from '../actions/updateWidget';
import { UpdateTree, UPDATE_TREE } from '../actions/updateTree';

const initialState: Store$Widget = {
  config: {},
  value: {},
};

export const widget = (
  state: Store$Widget = initialState,
  action: UpdateWidget | UpdateTree,
): Store$Widget => {
  switch (action.type) {
    case UPDATE_WIDGET: {
      return {
        ...state,
        value: {
          ...state.value,
          [action.payload.id]: action.payload.exposedProperties,
        },
      };
    }
    case UPDATE_TREE: {
      const { widgets: config } = action.payload;
      const value = Object.keys(config).reduce((acc, cur) => {
        if (JSON.stringify(config[cur]) !== JSON.stringify(state.config[cur])) {
          // TODO populate exposed properties
          return { ...acc, [cur]: {} };
        }
        return { ...acc, [cur]: state.value[cur] };
      }, {});
      return { ...state, config, value };
    }
    default:
      return state;
  }
};
