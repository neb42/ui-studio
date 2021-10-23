import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { FilePaths } from '../FilePaths';

import { UIStudioConfig } from './parseConfig';

const generateComponentTypesFile = async (config: UIStudioConfig): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'componentTypes.mst'));
  const dependencies = Object.values(config.dependencies);
  const renderedFile = Mustache.render(data.toString(), {
    components: dependencies.filter((d) => d.componentsImportPath !== null),
    entryPoints: dependencies.filter((d) => d.entryPointImportPath !== null),
  });
  return fs.writeFile(path.join(FilePaths.clientSrc, 'component-packages.d.ts'), renderedFile);
};

export default generateComponentTypesFile;
