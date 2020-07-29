const buildFunction = (name: string, deps: string[]) =>
  `${name}({${deps.join(', ')}})`;

interface BuildServerTemplateParamsArgs {
  serverFunctions: string[];
  queries: string[];
  deps: string[];
}

export const buildServerTemplateParams = ({
  serverFunctions,
  queries,
  deps,
}: BuildServerTemplateParamsArgs) => ({
  ...serverFunctions.reduce((acc, cur) => ({
    ...acc,
    [cur]: buildFunction(cur, deps),
  }), {}),
  ...queries.reduce((acc, cur) => ({
    ...acc,
    [cur]: buildFunction(cur, deps),
  }), {}),
  ...deps.reduce((acc, cur) => ({
    ...acc,
    [cur]: cur,
  }), {}),
}); 