import { Widget, CustomComponentInstance } from '@ui-studio/types';
import { UPDATE_WIDGET_STYLE } from 'actions/styles';
import { ADD_WIDGET_EVENT, UPDATE_WIDGET_EVENT, REMOVE_WIDGET_EVENT } from 'actions/event';
import { UPDATE_WIDGET_LAYOUT_CONFIG, UPDATE_WIDGET_LAYOUT_TYPE } from 'actions/layout';
import {
  ADD_WIDGET,
  REMOVE_WIDGET,
  UPDATE_WIDGET_PROPS,
  UPDATE_WIDGET_PARENT,
  UPDATE_WIDGET_POSITION,
  Action$Widget,
} from 'actions/widget';
import { UPDATE_WIDGET_NAME } from 'actions/name';
import {
  ADD_CUSTOM_COMPONENT,
  UPDATE_EXPOSED_PROPERTY_KEY,
  REMOVE_CUSTOM_COMPONENT_CONFIG,
} from 'actions/customComponent';
import { ADD_PAGE } from 'actions/page';
import { INIT_CLIENT } from 'actions/init';
import { LayoutModel } from 'models/layout';
import { StylesModel } from 'models/styles';
import { WidgetModel } from 'models/widget';
import { Store$Widget, KeyedObject } from 'types/store';

const initialState: Store$Widget = {};

export const widgetReducer = (
  state: Store$Widget = initialState,
  action: Action$Widget,
): Store$Widget => {
  switch (action.type) {
    case ADD_PAGE:
    case ADD_CUSTOM_COMPONENT: {
      return {
        ...state,
        [action.payload.id]: {},
      };
    }

    case ADD_WIDGET: {
      const { rootId, widget } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          [widget.id]: widget,
        },
      };
    }

    case REMOVE_WIDGET: {
      const { rootId, widgetId, parent, position, delete: del } = action.payload;

      return {
        ...state,
        [rootId]: Object.keys(state[rootId]).reduce((acc, cur) => {
          const current = state[rootId][cur];
          if (current.id === widgetId) {
            if (del) return acc;
            return {
              ...acc,
              [cur]: {
                ...current,
                position: null,
                parent: null,
              },
            };
          }
          return {
            ...acc,
            [cur]: {
              ...current,
              position:
                current.parent === parent && current.position > position
                  ? current.position - 1
                  : current.position,
            },
          };
        }, {}),
      };
    }

    case UPDATE_WIDGET_NAME: {
      const { rootId, widgetId, name } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          [widgetId]: {
            ...state[rootId][widgetId],
            name,
          },
        },
      };
    }

    case UPDATE_WIDGET_STYLE: {
      const { rootId, widgetId, style } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          [widgetId]: {
            ...state[rootId][widgetId],
            style,
          },
        },
      };
    }

    case UPDATE_WIDGET_PROPS: {
      const { rootId, widgetId, key, prop } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          [widgetId]: {
            ...state[rootId][widgetId],
            props: {
              ...state[rootId][widgetId].props,
              [key]: prop,
            },
          },
        },
      };
    }

    case ADD_WIDGET_EVENT: {
      const { rootId, widgetId, eventKey, event } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          [widgetId]: {
            ...state[rootId][widgetId],
            events: {
              ...state[rootId][widgetId].events,
              [eventKey]: [...state[rootId][widgetId].events[eventKey], event],
            },
          },
        },
      };
    }

    case UPDATE_WIDGET_EVENT: {
      const { rootId, widgetId, eventKey, index, event } = action.payload;
      const events = state[rootId][widgetId].events[eventKey];
      events[index] = event;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          [widgetId]: {
            ...state[rootId][widgetId],
            events: {
              ...state[rootId][widgetId].events,
              [eventKey]: events,
            },
          },
        },
      };
    }

    case REMOVE_WIDGET_EVENT: {
      const { rootId, widgetId, eventKey, index } = action.payload;
      const events = state[rootId][widgetId].events[eventKey];
      events.splice(index, 1);
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          [widgetId]: {
            ...state[rootId][widgetId],
            events: {
              ...state[rootId][widgetId].events,
              [eventKey]: events,
            },
          },
        },
      };
    }

    case UPDATE_WIDGET_LAYOUT_CONFIG: {
      const { rootId, widgetId, layout } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          [widgetId]: {
            ...state[rootId][widgetId],
            layout,
          },
        },
      };
    }

    case UPDATE_WIDGET_LAYOUT_TYPE: {
      const { rootId, widgetId, layoutType } = action.payload;
      const widget = {
        ...state[rootId][widgetId],
        layout: LayoutModel.getDefaultLayout(layoutType),
      };
      const widgets = Object.keys(state[rootId]).reduce((acc, cur) => {
        if (cur === widgetId) {
          return {
            ...acc,
            [cur]: widget,
          };
        }
        if (state[rootId][widgetId].parent === widgetId) {
          return {
            ...acc,
            [cur]: {
              ...state[cur],
              style: StylesModel.getDefaultStyle(widget),
            },
          };
        }
        return {
          ...acc,
          [cur]: state[rootId][widgetId],
        };
      }, {});
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          ...widgets,
        },
      };
    }

    case UPDATE_WIDGET_PARENT: {
      const { rootId, widgetId, parentId, position } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          [widgetId]: {
            ...state[rootId][widgetId],
            parent: parentId,
            position,
          },
        },
      };
    }

    case UPDATE_WIDGET_POSITION: {
      const { rootId, widgetId, source, destination, style } = action.payload;
      const widgets = Object.keys(state[rootId].widgets).reduce((acc, cur) => {
        const widget = WidgetModel.updatePosition(
          state[rootId][cur],
          widgetId,
          source,
          destination,
          style,
        );
        return {
          ...acc,
          [cur]: widget,
        };
      }, {});
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          ...widgets,
        },
      };
    }

    case UPDATE_EXPOSED_PROPERTY_KEY: {
      const { rootId, oldKey, newKey } = action.payload;

      const doProps = (props: Widget['props'], currentRootId: string) =>
        Object.keys(props).reduce<Widget['props']>((acc, cur) => {
          const currentProp = props[cur];
          if (currentProp.mode === 'widget' && currentProp.property === oldKey) {
            const propWidget = state[currentRootId][currentProp.widgetId];
            if (
              propWidget.type === 'customComponentInstance' &&
              propWidget.customComponentId === rootId
            ) {
              return {
                ...acc,
                [cur]: {
                  ...currentProp,
                  lookup: newKey,
                },
              };
            }
          }
          return { ...acc, [cur]: currentProp };
        }, {});

      const doWidgets = (
        widgets: KeyedObject<Widget | CustomComponentInstance>,
        currentRootId: string,
      ) =>
        Object.keys(widgets).reduce<KeyedObject<Widget | CustomComponentInstance>>((acc, cur) => {
          const current = widgets[cur];
          return {
            ...acc,
            [cur]: {
              ...current,
              props: doProps(current.props, currentRootId),
            },
          };
        }, {});

      return Object.keys(state).reduce((acc, cur) => {
        return {
          ...acc,
          [cur]: doWidgets(state[cur], cur),
        };
      }, {});
    }

    case REMOVE_CUSTOM_COMPONENT_CONFIG: {
      const { rootId, key } = action.payload;

      const doRoot = (currentRootId: string) =>
        Object.keys(state[currentRootId]).reduce((acc, cur) => {
          const widget = state[currentRootId][cur];
          if (widget.type === 'customComponentInstance' && widget.customComponentId === rootId) {
            const { [key]: _, ...props } = widget.props;
            return {
              ...acc,
              [cur]: {
                ...widget,
                props,
              },
            };
          }
          return {
            ...acc,
            [cur]: widget,
          };
        }, {});

      return Object.keys(state).reduce((acc, cur) => {
        return {
          ...acc,
          [cur]: doRoot(cur),
        };
      }, {});
    }

    case INIT_CLIENT: {
      const { tree } = action.payload;
      return Object.keys(tree).reduce((acc, cur) => {
        return {
          ...acc,
          [cur]: tree[cur].widgets,
        };
      }, {});
    }
    default:
      return state;
  }
};
