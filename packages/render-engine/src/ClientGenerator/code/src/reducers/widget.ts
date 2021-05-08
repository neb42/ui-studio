import { CustomComponentInstance, Widget } from '@ui-studio/types';

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
      const { widgetId, rootId, exposedProperties } = action.payload;
      if (rootId) {
        return {
          ...state,
          value: {
            ...state.value,
            [rootId]: {
              ...state.value[rootId],
              [widgetId]: exposedProperties,
            },
          },
        };
      }
      return {
        ...state,
        value: {
          ...state.value,
          [widgetId]: exposedProperties,
        },
      };
    }
    case UPDATE_TREE: {
      const { tree } = action.payload;

      const getWidgetValuesForRoot = (
        widgets: KeyedObject<Widget | CustomComponentInstance>,
        rootId: string,
      ): Store$Widget['value'] =>
        Object.keys(widgets).reduce<Store$Widget['value']>((acc, cur) => {
          if (JSON.stringify(widgets[cur]) !== JSON.stringify(state.config[cur])) {
            // TODO populate exposed properties
            const w = tree[rootId].widgets[cur];
            if (w.type === 'customComponentInstance') {
              return {
                ...acc,
                [cur]: getWidgetValuesForRoot(
                  tree[w.customComponentId].widgets,
                  w.customComponentId,
                ),
              };
            }
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
            ...getWidgetValuesForRoot(cur.widgets, cur.root.id),
          };
        }, {}),
      };
    }
    default:
      return state;
  }
};
