import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { FilePaths } from '../FilePaths';

import { UIStudioConfig } from './parseConfig';

const generateComponentsFile = async (config: UIStudioConfig): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'components.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    dependencies: Object.values(config.dependencies).filter((d) => d.componentsImportPath !== null),
  });
  return fs.writeFile(path.join(FilePaths.clientSrc, 'Components.ts'), renderedFile);
};

export default generateComponentsFile;
