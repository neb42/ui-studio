import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';
import { Widget, Variable, StaticVariable, FunctionVariable } from '@ui-builder/types';

import { FilePaths } from '../FilePaths';

const generateVariablesReducerFile = async (variables: Variable[]): Promise<void> => {
  const staticVariables = (variables.filter((v) => v.type === 'static') as StaticVariable[]).map(
    (v) => {
      if (v.valueType === 'string')
        return {
          ...v,
          value: typeof v.value === 'string' ? `'${v.value}'` : v.value,
        };
      if (v.valueType === 'object')
        return {
          ...v,
          value: JSON.parse(v.value),
        };
      return v;
    },
  );
  const functionVariables = (variables.filter(
    (v) => v.type === 'function',
  ) as FunctionVariable[]).map((f) => ({
    ...f,
    args: f.args.map((a) =>
      a.type === 'static' && a.valueType === 'string'
        ? { ...a, value: typeof a.value === 'string' ? `'${a.value}'` : a.value }
        : a,
    ),
  }));

  const data = await fs.readFile(path.join(__dirname, 'templates', 'VariableReducer.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    staticVariables,
    functionVariables,
  });
  return fs.writeFile(path.join(FilePaths.reducers, 'variable.js'), renderedFile);
};

const generateWidgetReducerFile = async (widgets: Widget[]): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'WidgetReducer.mst'));
  const renderedFile = Mustache.render(data.toString(), { widgets });
  return fs.writeFile(path.join(FilePaths.reducers, 'widget.js'), renderedFile);
};

const generateRootReducerFile = async (): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'RootReducer.mst'));
  const renderedFile = Mustache.render(data.toString(), {});
  return fs.writeFile(path.join(FilePaths.reducers, 'index.js'), renderedFile);
};

const generateReducerFiles = async (widgets: Widget[], variables: Variable[]): Promise<void[]> => {
  return Promise.all([
    generateWidgetReducerFile(widgets),
    generateVariablesReducerFile(variables),
    generateRootReducerFile(),
  ]);
};

export default generateReducerFiles;
