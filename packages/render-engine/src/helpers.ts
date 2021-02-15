const buildFunction = (name: string, deps: string[], escapeFunctions: boolean) => {
  const depsString = deps.map((d) => `func_${d}`).join(', ');
  const foo = `${name}({${depsString}})`;

  if (escapeFunctions) {
    return `\${${foo}}}`;
  }
  return foo;
};

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
  ...serverFunctions.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: buildFunction(cur, deps, escapeFunctions),
    }),
    {},
  ),
  ...queries.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: buildFunction(cur, deps, escapeFunctions),
    }),
    {},
  ),
  ...deps.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: cur,
    }),
    {},
  ),
});

export const makeName = (name: string, id: string, ext = false): string =>
  `${name.replace(/ /g, '_')}_${id.replace(/-/g, '')}${ext ? '.js' : ''}`;
