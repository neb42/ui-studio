import axios from 'axios';
import { Dispatch } from 'redux';
import SwaggerClient from 'swagger-client';
import { OpenAPIV3 } from 'openapi-types';

export interface InitApi {
  type: 'INIT_API';
  payload: OpenAPIV3.Document;
}

export const INIT_API = 'INIT_API';

export const initApi = () => async (dispatch: Dispatch<InitApi>): Promise<void> => {
  try {
    const { data, status } = await axios.post('/openapi.json');

    if (status !== 200) throw new Error(`Status code: ${status}`);

    const resolvedSchema = (await SwaggerClient.resolve({ spec: data })).spec as OpenAPIV3.Document;

    dispatch({
      type: INIT_API,
      payload: resolvedSchema,
    });
  } catch {}
};
