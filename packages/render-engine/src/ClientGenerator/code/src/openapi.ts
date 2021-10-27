import axios from 'axios';
import { OpenAPIV3 } from 'openapi-types';
import { FunctionVariableArg } from '@ui-studio/types';

import { Store } from './types/store';
import { resolveArgSet } from './selectors';

const isJson = (maybeJSON: unknown) => {
  try {
    let foo = typeof maybeJSON !== 'string' ? JSON.stringify(maybeJSON) : maybeJSON;

    try {
      foo = JSON.parse(foo);
    } catch (e) {
      return false;
    }

    if (typeof foo === 'object' && foo !== null) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

export const makeOpenAPIRequest = async (
  state: Store,
  path: string,
  method: OpenAPIV3.HttpMethods,
  pathArgs: Record<string, FunctionVariableArg>,
  queryArgs: Record<string, FunctionVariableArg>,
  bodyArgs: Record<string, FunctionVariableArg>,
  rootId: string | null,
  event?: any,
): Promise<any> => {
  const url = (() => {
    let u = path;
    const resolvedPathArgs = resolveArgSet(state, pathArgs, rootId);
    Object.keys(pathArgs).forEach((key) => {
      u = u.replace(`{${key}}`, resolvedPathArgs[key]);
    });
    return u;
  })();

  const queryParams = resolveArgSet(state, queryArgs, rootId);

  const body = {
    ...resolveArgSet(state, bodyArgs, rootId),
    __event__: isJson(event) ? event : null,
  };

  if (method === OpenAPIV3.HttpMethods.TRACE) throw new Error('TRACE method not supported');

  const { data, status } = await axios({
    method,
    url,
    params: queryParams,
    data: body,
  });

  return data;
};

export const get2xxResponseSchema = (
  responses: OpenAPIV3.ResponsesObject,
  content = 'application/json',
): OpenAPIV3.SchemaObject => {
  const responseCode = Object.keys(responses).find((c) => Number(c) >= 200 && Number(c) < 300);
  if (!responseCode) throw new Error();
  const response = responses[responseCode];
  if ('ref' in response) throw new Error();
  const schema = (response as OpenAPIV3.ResponseObject).content?.[content]?.schema;
  if (!schema || 'ref' in schema) throw new Error();
  return schema as OpenAPIV3.SchemaObject;
};

export const getResponseSchemaForEndpoint = (
  spec: OpenAPIV3.Document,
  path: string,
  method: OpenAPIV3.HttpMethods,
): OpenAPIV3.SchemaObject => {
  const endpoint = spec.paths?.[path]?.[method];
  const responses = endpoint?.responses;
  if (!responses) throw new Error();
  return get2xxResponseSchema(responses);
};
