import { INIT_CLIENT } from 'actions/init';
import { UPDATE_CUSTOM_COMPONENT_NAME } from 'actions/name';
import { UPDATE_CUSTOM_COMPONENT_STYLE } from 'actions/styles';
import {
  ADD_CUSTOM_COMPONENT,
  REMOVE_CUSTOM_COMPONENT,
  ADD_EXPOSED_PROPERTY,
  REMOVE_EXPOSED_PROPERTY,
  UPDATE_EXPOSED_PROPERTY_KEY,
  ADD_CUSTOM_COMPONENT_CONFIG,
  UPDATE_CUSTOM_COMPONENT_CONFIG,
  REMOVE_CUSTOM_COMPONENT_CONFIG,
  Action$CustomComponent,
} from 'actions/customComponent';
import { Store$CustomComponent } from 'types/store';

const initialState: Store$CustomComponent = {};

export const customComponentReducer = (
  state: Store$CustomComponent = initialState,
  action: Action$CustomComponent,
): Store$CustomComponent => {
  switch (action.type) {
    case ADD_CUSTOM_COMPONENT: {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    }
    case REMOVE_CUSTOM_COMPONENT: {
      const { [action.payload]: _, ...remaining } = state;
      return remaining;
    }
    case UPDATE_CUSTOM_COMPONENT_NAME: {
      const { rootId, name } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          name,
        },
      };
    }
    case UPDATE_CUSTOM_COMPONENT_STYLE: {
      const { rootId, style } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          style,
        },
      };
    }

    case ADD_EXPOSED_PROPERTY: {
      const { rootId, key, exposedProperty } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          exposedProperties: {
            ...state[rootId].exposedProperties,
            [key]: exposedProperty,
          },
        },
      };
    }

    case REMOVE_EXPOSED_PROPERTY: {
      const { rootId, key } = action.payload;
      const { [key]: _, ...exposedProperties } = state[rootId].exposedProperties || {};
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          exposedProperties,
        },
      };
    }

    case UPDATE_EXPOSED_PROPERTY_KEY: {
      const { rootId, oldKey, newKey } = action.payload;
      const { [oldKey]: exposedProperty, ...exposedProperties } =
        state[rootId].exposedProperties || {};
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          exposedProperties: {
            ...exposedProperties,
            [newKey]: exposedProperty,
          },
        },
      };
    }

    case ADD_CUSTOM_COMPONENT_CONFIG: {
      const { rootId, config } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          config: [...(state[rootId].config || []), config],
        },
      };
    }
    case UPDATE_CUSTOM_COMPONENT_CONFIG: {
      const { rootId, key, config } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          config: state[rootId].config?.map((c) => {
            if (c.key === key) return config;
            return c;
          }),
        },
      };
    }
    case REMOVE_CUSTOM_COMPONENT_CONFIG: {
      const { rootId, key } = action.payload;
      return {
        ...state,
        [rootId]: {
          ...state[rootId],
          config: state[rootId].config?.filter((c) => c.key !== key),
        },
      };
    }

    case INIT_CLIENT: {
      const { tree } = action.payload;
      return Object.keys(tree).reduce((acc, cur) => {
        const { root } = tree[cur];
        if (root.type === 'customComponent') {
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
