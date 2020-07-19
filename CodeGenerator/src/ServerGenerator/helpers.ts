const buildFunction = ({ name, dependencies }) => `${name}({${getClientDeps(dependencies).map(d => d.name).join(', ')}})`;

export const getClientDeps = ({ serverFunctions, components, clientFunctions, queries }: Dependencies) => {
  return [
    ...components,
    ...clientFunctions,
    ...serverFunctions.flatMap(s => getClientDeps(s.dependencies)),
    ...queries.flatMap(q => getClientDeps(q.dependencies)),
  ];
};

export const getQueryDeps = ({ serverFunctions, components, clientFunctions, queries }: Dependencies) => {
  return [
    ...queries,
    ...components.flatMap(c => getQueryDeps(c.dependencies)),
    ...clientFunctions.flatMap(c => getQueryDeps(c.dependencies)),
  ];
}; 

export const getServerFunctionDeps = ({ serverFunctions, components, clientFunctions, queries }: Dependencies) => {
  return [
    ...queries,
    ...components.flatMap(c => getServerFunctionDeps(c.dependencies)),
    ...clientFunctions.flatMap(c => getServerFunctionDeps(c.dependencies)),
  ];
}; 

export const buildTemplateParams = (dependencies: Dependencies) => ({
  ...dependencies.serverFunctions.reduce((acc, cur) => ({
    ...acc,
    [cur.name]: buildFunction(cur),
  }), {}),
  ...dependencies.queries.reduce((acc, cur) => ({
    ...acc,
    [cur.name]: buildFunction(cur),
  }), {}),
  ...getClientDeps(dependencies).reduce((acc, cur) => ({
    ...acc,
    [cur.name]: cur.name,
  }), {}),
}); 
