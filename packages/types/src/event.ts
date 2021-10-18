import { OpenAPIV3 } from 'openapi-types';

import { FunctionVariableArg } from './variable';

export interface Event$UpdateVariable {
  type: 'update-variable';
  variableId: string;
}

// export interface Event$ResetVariable {
//   type: 'reset-variable';
//   variableId: string;
// }

export interface Event$TriggerAction {
  type: 'trigger-action';
  actionId: {
    path: string;
    method: OpenAPIV3.HttpMethods;
  };
  args: {
    path: Record<string, FunctionVariableArg>;
    query: Record<string, FunctionVariableArg>;
    body: Record<string, FunctionVariableArg>;
  };
}

export interface Event$NavigatePage {
  type: 'navigate-page';
  pageId: string;
}

export type Event = Event$UpdateVariable | Event$TriggerAction | Event$NavigatePage;
