import { Dispatch } from 'redux';
import SwaggerClient from 'swagger-client';
import { OpenAPIV3 } from 'openapi-types';

export interface InitApi {
  type: 'INIT_API';
  payload: OpenAPIV3.Document;
}

export const INIT_API = 'INIT_API';

export const initApi = (schema: OpenAPIV3.Document) => async (
  dispatch: Dispatch<InitApi>,
): Promise<void> => {
  try {
    const resolvedSchema = (await SwaggerClient.resolve({ spec: schema }))
      .spec as OpenAPIV3.Document;

    dispatch({
      type: INIT_API,
      payload: resolvedSchema,
    });
  } catch {}
};
