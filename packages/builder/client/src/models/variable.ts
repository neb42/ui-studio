import { OpenAPIV3 } from 'openapi-types';
import { Variable } from '@ui-studio/types';
import { getResponseSchemaForEndpoint, getSchemaForLookup, getSchemaType } from 'utils/openapi';
import { Store$Variable } from 'types/store';

export class VariableModel {
  static updateVariableType(
    variable: Variable,
    type: Variable['type'],
    openAPISchema: OpenAPIV3.Document,
    allVariables: Store$Variable,
  ): Variable {
    if (type === 'static') {
      const existingValueType = VariableModel.getValueType(variable, openAPISchema, allVariables);
      switch (existingValueType) {
        case 'string':
        case 'object':
        case 'array': {
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

    if (type === 'lookup') {
      return {
        id: variable.id,
        name: variable.name,
        type: 'lookup',
        variableId: '',
        lookup: '',
      };
    }

    throw new Error();
  }

  static getValueType(
    variable: Variable,
    openAPISchema: OpenAPIV3.Document,
    allVariables: Store$Variable,
  ): 'string' | 'number' | 'boolean' | 'object' | 'array' {
    if (variable.type === 'static') return variable.valueType;

    if (variable.type === 'function') {
      const responseSchema = getResponseSchemaForEndpoint(
        openAPISchema,
        variable.functionId.path,
        variable.functionId.method,
      );

      const schemaType = getSchemaType(responseSchema);
      return schemaType;
    }

    if (variable.type === 'lookup') {
      const referencedVariable = allVariables[variable.variableId];
      if (referencedVariable.type !== 'function') throw new Error();

      const responseSchema = getResponseSchemaForEndpoint(
        openAPISchema,
        referencedVariable.functionId.path,
        referencedVariable.functionId.method,
      );

      const lookupSchema = getSchemaForLookup(responseSchema, variable.lookup);

      const schemaType = getSchemaType(lookupSchema);
      return schemaType;
    }

    throw new Error();
  }
}
