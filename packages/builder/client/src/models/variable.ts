import { OpenAPIV3 } from 'openapi-types';
import { Variable } from '@ui-studio/types';

export class VariableModel {
  static updateVariableType(
    variable: Variable,
    type: Variable['type'],
    openAPISchema: OpenAPIV3.Document,
  ): Variable {
    if (type === 'static') {
      const existingValueType = VariableModel.getValueType(variable, openAPISchema);
      switch (existingValueType) {
        case 'string': {
          return {
            id: variable.id,
            name: variable.name,
            type: 'static',
            valueType: 'string',
            value: '',
          };
        }
        case 'number': {
          return {
            id: variable.id,
            name: variable.name,
            type: 'static',
            valueType: 'number',
            value: 0,
          };
        }
        case 'boolean': {
          return {
            id: variable.id,
            name: variable.name,
            type: 'static',
            valueType: 'boolean',
            value: true,
          };
        }
        case 'object': {
          return {
            id: variable.id,
            name: variable.name,
            type: 'static',
            valueType: 'object',
            value: '',
          };
        }
        default:
          throw new Error();
      }
    }
    if (type === 'function') {
      return {
        id: variable.id,
        name: variable.name,
        type: 'function',
        functionId: {
          path: '',
          method: OpenAPIV3.HttpMethods.GET,
        },
        trigger: 'auto',
        args: {
          path: {},
          query: {},
          body: {},
        },
      };
    }
    throw new Error();
  }

  static getValueType(
    variable: Variable,
    openAPISchema: OpenAPIV3.Document,
  ): 'string' | 'number' | 'boolean' | 'object' {
    if (variable.type === 'static') return variable.valueType;

    const functionSchema = (() => {
      const responses =
        openAPISchema.paths?.[variable.functionId.path]?.[variable.functionId.method]?.responses;
      if (!responses) throw new Error();
      const responseCode = Object.keys(responses).find((c) => Number(c) >= 200 && Number(c) < 300);
      if (!responseCode) throw new Error();
      const response = responses[responseCode];
      if ('ref' in response) throw new Error();
      const schema = (response as OpenAPIV3.ResponseObject).content?.['application/json']?.schema;
      if (!schema || 'ref' in schema) throw new Error();
      return schema as OpenAPIV3.SchemaObject;
    })();

    const validateValueType = (
      valueType: OpenAPIV3.SchemaObject['type'],
    ): 'string' | 'number' | 'boolean' | 'object' => {
      if (!valueType) throw new Error();
      if (valueType === 'array') throw new Error('Array types not supported');
      if (valueType === 'integer') return 'number';
      return valueType;
    };

    const functionRootType = validateValueType(functionSchema.type);

    if (variable.lookup && functionRootType === 'object') {
      const { properties } = functionSchema;
      if (!properties || 'ref' in properties) throw new Error();
      const nestedSchema = properties[variable.lookup];
      if (!nestedSchema || 'ref' in nestedSchema) throw new Error();
      return validateValueType((nestedSchema as OpenAPIV3.SchemaObject).type);
    }

    return functionRootType;
  }
}
