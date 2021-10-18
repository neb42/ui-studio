import { OpenAPIV3 } from 'openapi-types';
import { Store$View } from 'types/store';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export type OpenModal<T extends keyof Store$View['modal']> = {
  type: 'OPEN_MODAL';
  payload: {
    key: T;
    data:
      | {
          type: 'function';
          id: string;
          path: string;
          method: OpenAPIV3.HttpMethods;
        }
      | {
          type: 'action';
          // pageId, widgetId, eventKey, eventInstanceIndex
          id: [string, string, string, number];
          path: string;
          method: OpenAPIV3.HttpMethods;
        };
  };
};

export type CloseModal = {
  type: 'CLOSE_MODAL';
};

export const openFunctionConfigurationModal = (
  id: string,
  path: string,
  method: OpenAPIV3.HttpMethods,
): OpenModal<'functionConfiguration'> => ({
  type: OPEN_MODAL,
  payload: {
    key: 'functionConfiguration',
    data: {
      type: 'function',
      id,
      path,
      method,
    },
  },
});

export const openActionConfigurationModal = (
  pageId: string,
  widgetId: string,
  eventKey: string,
  eventInstanceIndex: number,
  path: string,
  method: OpenAPIV3.HttpMethods,
): OpenModal<'functionConfiguration'> => ({
  type: OPEN_MODAL,
  payload: {
    key: 'functionConfiguration',
    data: {
      type: 'action',
      id: [pageId, widgetId, eventKey, eventInstanceIndex],
      path,
      method,
    },
  },
});

export const closeModal = (): CloseModal => ({
  type: CLOSE_MODAL,
});
