export type InitFunctions = { 
  name: string;
  returnType: 'string' | 'number' | 'boolean';
  args: { name: string, type: 'string' | 'number' | 'boolean' }[];
}; 