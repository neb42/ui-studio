import { promises as fs } from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

const generateSimpleSelectorFile = async (name: string, type: string, basePath: string) => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'SimpleSelector.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    name,
    type,
  });
  return fs.writeFile(path.join(basePath, `${name}.js`), renderedFile);
};

const generateFunctionSelectorFile = async (clientFunction: ClientFunction, basePath: string): Promise<void> => {
  const patternWithG = /\{\{ ([a-zA-Z0-9_]*)(\.?[a-zA-Z0-9_]*?) \}\}/g;
  const patternWithoutG = /\{\{ ([a-zA-Z0-9_]*)(\.?[a-zA-Z0-9_]*?) \}\}/;
  const data = await fs.readFile(path.join(__dirname, 'templates', 'FunctionSelector.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    name: clientFunction.name,
    functionString: clientFunction.functionString.replace(patternWithG, 'selector_$1(state)$2'),
    dependencies: [...clientFunction.functionString.matchAll(patternWithoutG)].map(m => m[1]),
  });
  return fs.writeFile(path.join(basePath, `${clientFunction.name}.js`), renderedFile);
};

const generateSelectorFiles = async (
  widgets: Widget[],
  clientFunctions: ClientFunction[],
  basePath: string,
  getChildrenOfTypes: (nodeKey: string, types: string[]) => string[],
): Promise<void[]> => {
  const both = [...widgets, ...clientFunctions];
  const queries = both.flatMap(f => getChildrenOfTypes(f.name, ['query']));
  const serverFunctions = both.flatMap(f => getChildrenOfTypes(f.name, ['serverFunction']));

  return Promise.all([
    ...clientFunctions.map(c => generateFunctionSelectorFile(c, basePath)),
    ...widgets.map(w => generateSimpleSelectorFile(w.name, 'widget', basePath)),
    ...queries.map(q => generateSimpleSelectorFile(q, 'query', basePath)),
    ...serverFunctions.map(s => generateSimpleSelectorFile(s, 'serverFunction', basePath)),
  ]);
};

export default generateSelectorFiles;