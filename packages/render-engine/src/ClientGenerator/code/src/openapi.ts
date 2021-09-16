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
  event?: any,
): Promise<any> => {
  const url = (() => {
    let u = path;
    const resolvedPathArgs = resolveArgSet(state, pathArgs);
    Object.keys(pathArgs).forEach((key) => {
      u = u.replace(`{${key}}`, resolvedPathArgs[key]);
    });
    return u;
  })();

  const queryParams = resolveArgSet(state, queryArgs);

  const body = {
    ...resolveArgSet(state, bodyArgs),
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
