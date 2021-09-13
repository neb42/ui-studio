import { Dispatch } from 'redux';
import { OpenAPIV3 } from 'openapi-types';
import SwaggerClient from 'swagger-client';
import { Component } from '@ui-studio/types';
import { InitClient } from 'actions/init';
import { TThunkAction } from 'types/store';

interface IInitAPI {
  type: 'INIT_API';
  payload: OpenAPIV3.Document;
}

export const INIT_API = 'INIT_API';

export const initApi = (schema: OpenAPIV3.Document): TThunkAction<Promise<IInitAPI>> => async (
  dispatch: Dispatch<IInitAPI>,
) => {
  const resolvedSchema = (await SwaggerClient.resolve({ spec: schema })).spec;

  return dispatch({
    type: INIT_API,
    payload: resolvedSchema,
  });
};

interface IInitComponents {
  type: 'INIT_COMPONENTS';
  payload: Component[];
}

export const INIT_COMPONENTS = 'INIT_COMPONENTS';

export const initComponents = (components: Component[]): IInitComponents => ({
  type: INIT_COMPONENTS,
  payload: components,
});

export type Action$Configuration = IInitAPI | IInitComponents | InitClient;
