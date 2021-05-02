import { Widget } from '@ui-studio/types';

import { Store$Widget, KeyedObject } from '../types/store';
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
      const { tree } = action.payload;

      const getWidgetValuesForRoot = (widgets: KeyedObject<Widget>) =>
        Object.keys(widgets).reduce((acc, cur) => {
          if (JSON.stringify(widgets[cur]) !== JSON.stringify(state.config[cur])) {
            // TODO populate exposed properties
            return { ...acc, [cur]: {} };
          }
          return { ...acc, [cur]: state.value[cur] };
        }, {});

      return {
        config: Object.values(tree).reduce((acc, cur) => {
          return { ...acc, ...cur.widgets };
        }, {}),
        value: Object.values(tree).reduce((acc, cur) => {
          return {
            ...acc,
            ...getWidgetValuesForRoot(cur.widgets),
          };
        }, {}),
      };
    }
    default:
      return state;
  }
};
