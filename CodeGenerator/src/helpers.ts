const buildFunction = (name: string, deps: string[], escapeFunctions: boolean) => escapeFunctions
  ? '${' + name + '({' + deps.join(', ') + '})' + '}'  
  : `${name}({${deps.join(', ')}})`;

interface BuildServerTemplateParamsArgs {
  serverFunctions: string[];
  queries: string[];
  deps: string[];
  escapeFunctions: boolean;
}

export const buildServerTemplateParams = ({
  serverFunctions,
  queries,
  deps,
  escapeFunctions,
}: BuildServerTemplateParamsArgs) => ({
  ...serverFunctions.reduce((acc, cur) => ({
    ...acc,
    [cur]: buildFunction(cur, deps, escapeFunctions),
  }), {}),
  ...queries.reduce((acc, cur) => ({
    ...acc,
    [cur]: buildFunction(cur, deps, escapeFunctions),
  }), {}),
  ...deps.reduce((acc, cur) => ({
    ...acc,
    [cur]: cur,
  }), {}),
}); 