export interface FunctionDefinition {
  name: string;
  returnType: 'string' | 'number' | 'boolean' | 'object';
  args: { name: string; type: 'string' | 'number' | 'boolean' }[];
}

export interface ActionDefinition {
  name: string;
  args: { name: string; type: 'string' | 'number' | 'boolean' }[];
}

export interface InitFunctions {
  functions: FunctionDefinition[];
  actions: ActionDefinition[];
}
