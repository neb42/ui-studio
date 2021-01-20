export type InitFunctions = { 
  name: string;
  returnType: 'string' | 'number' | 'boolean' | 'object';
  args: { name: string, type: 'string' | 'number' | 'boolean' }[];
}; 