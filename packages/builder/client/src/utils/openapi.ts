import { OpenAPIV3 } from 'openapi-types';

import { parseLookupString } from './parseLookupString';

export const getSchemaForLookup = (
  schema: OpenAPIV3.SchemaObject,
  lookup: string,
): OpenAPIV3.SchemaObject => {
  const lookupParts = parseLookupString(lookup);
  return lookupParts.reduce((acc, cur) => {
    if (cur.type === 'object') {
      if (schema.type !== 'object') throw new Error();
      if (!schema.properties || !(cur.value in schema.properties)) throw new Error();
      const s = schema.properties[cur.value];
      if ('ref' in s) throw new Error();
      return s as OpenAPIV3.SchemaObject;
    }

    if (cur.type === 'array') {
      if (schema.type !== 'array') throw new Error();
      const s = schema as OpenAPIV3.ArraySchemaObject;
      if (!schema.items || 'ref' in schema.items) throw new Error();
      return s.items as OpenAPIV3.SchemaObject;
    }

    return schema;
  }, schema);
};

export const getSchemaType = (
  schema: OpenAPIV3.SchemaObject,
  lookup?: string,
): 'string' | 'number' | 'boolean' | 'object' | 'array' => {
  const s = lookup ? getSchemaForLookup(schema, lookup) : schema;
  if (!s.type) throw new Error();
  if (s.type === 'integer') return 'number';
  return s.type;
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

export const compareSchemas = (a: OpenAPIV3.SchemaObject, b: OpenAPIV3.SchemaObject): boolean => {
  if (a.type !== b.type) return false;
  if (a.type === 'array' && b.type === 'array') {
    const { items: itemsA } = a;
    const { items: itemsB } = b;
    if ('ref' in itemsA || 'ref' in itemsB) throw new Error();
    return compareSchemas(a.items as OpenAPIV3.SchemaObject, b.items as OpenAPIV3.SchemaObject);
  }
  if (a.type === 'object' && b.type === 'object') {
    const aKeys = Object.keys(a.properties || {}).sort();
    const bKeys = Object.keys(b.properties || {}).sort();
    if (JSON.stringify(aKeys) !== JSON.stringify(bKeys)) return false;

    return Object.keys(a.properties || {}).every((k) => {
      const aSchema = a.properties?.[k];
      const bSchema = b.properties?.[k];
      if (!aSchema || !bSchema || 'ref' in aSchema || 'ref' in bSchema) throw new Error();
      return compareSchemas(aSchema as OpenAPIV3.SchemaObject, bSchema as OpenAPIV3.SchemaObject);
    });
  }
  return true;
};
