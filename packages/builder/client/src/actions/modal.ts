import { OpenAPIV3 } from 'openapi-types';
import { Store$View } from 'types/store';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export type OpenModal<T extends keyof Store$View['modal']> = {
  type: 'OPEN_MODAL';
  payload: {
    key: T;
    data: Omit<Store$View['modal'][T], 'open'>;
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

export const closeModal = (): CloseModal => ({
  type: CLOSE_MODAL,
});
