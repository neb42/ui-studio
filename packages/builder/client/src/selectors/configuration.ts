import { OpenAPIV3 } from 'openapi-types';
import { Component, FunctionVariable } from '@ui-studio/types';
import { Store, Store$Configuration } from 'types/store';

export const getComponents = (state: Store): Component[] => state.configuration.components;

export const getActions = (state: Store): { path: string; method: OpenAPIV3.HttpMethods }[] =>
  state.configuration.actions;

export const getFunctions = (state: Store): { path: string; method: OpenAPIV3.HttpMethods }[] =>
  state.configuration.functions;

export const getColorConfig = (state: Store): Store$Configuration['colors'] =>
  state.configuration.colors;

type ArgTypeLookup = {
  [argType in keyof FunctionVariable['args']]: {
    [path: string]: {
      [key in OpenAPIV3.HttpMethods]: {
        [argKey: string]: 'string' | 'number' | 'boolean';
      };
    };
  };
};

// TODO make this more typesafe
export const getArgTypeLookUp = (state: Store): ArgTypeLookup => {
  const schema = state.configuration.openAPISchema;

  const PATH = Object.keys(schema.paths).reduce((acc, path) => {
    return {
      ...acc,
      [path]: Object.keys(schema.paths?.[path] ?? {}).reduce((a, method) => {
        return {
          ...a,
          [method]: schema.paths?.[path]?.[method as OpenAPIV3.HttpMethods]?.parameters
            ?.filter(
              (p): p is OpenAPIV3.ParameterObject =>
                !('ref' in p) && (p as OpenAPIV3.ParameterObject).in === 'path',
            )
            ?.reduce((aa, cc) => {
              let s = cc.schema;
              if (!s) return aa;
              if ('ref' in s) throw new Error('');
              s = s as OpenAPIV3.SchemaObject;
              return {
                ...aa,
                [cc.name]: s.type,
              };
            }, {}),
        };
      }, {}),
    };
  }, {});

  const QUERY = Object.keys(schema.paths).reduce((acc, path) => {
    return {
      ...acc,
      [path]: Object.keys(schema.paths?.[path] ?? {}).reduce((a, method) => {
        return {
          ...a,
          [method]: schema.paths?.[path]?.[method as OpenAPIV3.HttpMethods]?.parameters
            ?.filter(
              (p): p is OpenAPIV3.ParameterObject =>
                !('ref' in p) && (p as OpenAPIV3.ParameterObject).in === 'query',
            )
            ?.reduce((aa, cc) => {
              let s = cc.schema;
              if (!s) return aa;
              if ('ref' in s) throw new Error('');
              s = s as OpenAPIV3.SchemaObject;
              return {
                ...aa,
                [cc.name]: s.type,
              };
            }, {}),
        };
      }, {}),
    };
  }, {});

  const BODY = Object.keys(schema.paths).reduce((acc, path) => {
    return {
      ...acc,
      [path]: Object.keys(schema.paths?.[path] ?? {}).reduce((a, method) => {
        let requestBody = schema.paths?.[path]?.[method as OpenAPIV3.HttpMethods]?.requestBody;
        if (!requestBody) return a;
        if ('ref' in requestBody) throw new Error();
        requestBody = requestBody as OpenAPIV3.RequestBodyObject;
        let requestBodySchema = requestBody.content?.['application/json']?.schema;
        if (!requestBodySchema) return a;
        if ('ref' in requestBodySchema) throw new Error();
        requestBodySchema = requestBodySchema as OpenAPIV3.SchemaObject;
        const { properties } = requestBodySchema;
        if (!properties) return a;
        return {
          ...a,
          [method]: Object.keys(properties).reduce((aa, argKey) => {
            let property = properties[argKey];
            if ('ref' in property) throw new Error();
            property = property as OpenAPIV3.SchemaObject;
            return {
              ...aa,
              [argKey]: property.type,
            };
          }, {}),
        };
      }, {}),
    };
  }, {});

  return {
    path: PATH,
    query: QUERY,
    body: BODY,
  };
};
