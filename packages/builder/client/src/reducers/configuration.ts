import { OpenAPIV3 } from 'openapi-types';
import { INIT_API, INIT_COMPONENTS, Action$Configuration } from 'actions/configuration';
import { INIT_CLIENT } from 'actions/init';
import { Store$Configuration } from 'types/store';

const initialState: Store$Configuration = {
  openAPISchema: {
    openapi: '3.0.2',
    info: { title: '', version: '0.0.0' },
    paths: {},
  },
  functions: [],
  actions: [],
  components: [],
  colors: null,
};

export const configuration = (
  state: Store$Configuration = initialState,
  action: Action$Configuration,
): Store$Configuration => {
  switch (action.type) {
    case INIT_COMPONENTS: {
      return {
        ...state,
        components: action.payload,
      };
    }
    case INIT_API: {
      return {
        ...state,
        functions: Object.keys(action.payload.paths).reduce<Store$Configuration['functions']>(
          (acc, cur) => {
            const pathObj = action.payload.paths[cur];
            if (pathObj && 'get' in pathObj) {
              return [...acc, { path: cur, method: OpenAPIV3.HttpMethods.GET }];
            }
            return acc;
          },
          [],
        ),
        actions: Object.keys(action.payload.paths).reduce<Store$Configuration['functions']>(
          (acc, cur) => {
            const pathObj = action.payload.paths[cur];
            if (pathObj && !('get' in pathObj)) {
              return [...acc, { path: cur, method: OpenAPIV3.HttpMethods.POST }];
            }
            return acc;
          },
          [],
        ),
      };
    }
    case INIT_CLIENT: {
      return {
        ...state,
        colors: action.payload.colors,
      };
    }
    default:
      return state;
  }
};
