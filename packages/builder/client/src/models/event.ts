import { OpenAPIV3 } from 'openapi-types';
import { Event, Event$TriggerAction, Value$Static } from '@ui-studio/types';
import { ArgTypeLookup } from 'selectors/configuration';

export class EventModel {
  // TODO set default args for actions
  // This is currently ok as when updating to an action the action isn't populated
  // Populating an action sets the default args correctly
  static getDefaultEvent = (
    eventType: 'update-variable' | 'reset-variable' | 'trigger-action' | 'navigate-page',
  ): Event => {
    switch (eventType) {
      case 'update-variable':
        return { type: eventType, variableId: '' };
      case 'trigger-action':
        return {
          type: eventType,
          actionId: { path: '', method: OpenAPIV3.HttpMethods.POST },
          args: {
            path: {},
            query: {},
            body: {},
          },
        };
      case 'navigate-page':
        return { type: eventType, pageId: '' };
      default:
        throw Error();
    }
  };

  static getDefaultFunctionArgs = (
    argTypeLookUp: ArgTypeLookup,
    path: string,
    method: OpenAPIV3.HttpMethods,
  ): Event$TriggerAction['args'] => {
    const staticArgTypeMap: {
      [argType in 'string' | 'boolean' | 'number' | 'integer']: Value$Static;
    } = {
      string: { mode: 'static', value: '' },
      boolean: { mode: 'static', value: true },
      number: { mode: 'static', value: 0 },
      integer: { mode: 'static', value: 0 },
    };
    const args = {
      path: Object.keys(argTypeLookUp.path[path][method]).reduce((acc, cur) => {
        return {
          ...acc,
          [cur]: staticArgTypeMap[argTypeLookUp.path[path][method][cur]],
        };
      }, {}),
      query: Object.keys(argTypeLookUp.query[path][method]).reduce((acc, cur) => {
        return {
          ...acc,
          [cur]: staticArgTypeMap[argTypeLookUp.query[path][method][cur]],
        };
      }, {}),
      body: Object.keys(argTypeLookUp.body[path][method]).reduce((acc, cur) => {
        return {
          ...acc,
          [cur]: staticArgTypeMap[argTypeLookUp.body[path][method][cur]],
        };
      }, {}),
    };
    return args;
  };
}
