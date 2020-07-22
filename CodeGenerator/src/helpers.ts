const buildFunction = (name: string, clientDeps: string[]) =>
  `${name}({${clientDeps.join(', ')}})`;

interface BuildTemplateParamsArgs {
  serverFunctions: string[],
  queries: string[],
  clientDeps: string[],
}

export const buildTemplateParams = ({
  serverFunctions,
  queries,
  clientDeps,
}: BuildTemplateParamsArgs) => ({
  ...serverFunctions.reduce((acc, cur) => ({
    ...acc,
    [cur]: buildFunction(cur, clientDeps),
  }), {}),
  ...queries.reduce((acc, cur) => ({
    ...acc,
    [cur]: buildFunction(cur, clientDeps),
  }), {}),
  ...clientDeps.reduce((acc, cur) => ({
    ...acc,
    [cur]: cur,
  }), {}),
}); 
