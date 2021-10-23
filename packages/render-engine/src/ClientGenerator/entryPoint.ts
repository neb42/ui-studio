import * as path from 'path';

import * as Mustache from 'mustache';
import fs from 'fs-extra';

import { FilePaths } from '../FilePaths';

import { UIStudioConfig } from './parseConfig';

const generateEntryPoint = async (config: UIStudioConfig): Promise<void> => {
  const customEntryPointPath = path.join(FilePaths.app, 'App.tsx');
  const hasCustomEntryPoint = fs.existsSync(customEntryPointPath);
  if (hasCustomEntryPoint) {
    fs.copyFileSync(customEntryPointPath, path.join(FilePaths.clientSrc, 'App.tsx'));
  }

  const data = await fs.readFile(path.join(__dirname, 'templates', 'entryPoint.mst'));
  const dependencies = Object.values(config.dependencies).filter(
    (d) => d.entryPointImportPath !== null,
  );
  const renderedFile = Mustache.render(data.toString(), {
    hasCustomEntryPoint,
    noDependencies: dependencies.length === 0,
    dependencies,
    reverseDependencies: dependencies.slice().reverse(),
  });
  return fs.writeFile(path.join(FilePaths.clientSrc, 'MergedEntryPoint.tsx'), renderedFile);
};

export default generateEntryPoint;
