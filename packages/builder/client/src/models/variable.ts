import { OpenAPIV3 } from 'openapi-types';
import { Variable } from '@ui-studio/types';

export class VariableModel {
  static updateVariableType(variable: Variable, type: Variable['type']): Variable {
    if (type === 'static') {
      switch (variable.valueType) {
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
        valueType: variable.valueType,
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
}
