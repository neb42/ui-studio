import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { FilePaths } from '../FilePaths';

const generateTSConfigFile = async (): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'tsconfig.json.mst'));
  const renderedFile = Mustache.render(data.toString(), {});
  return fs.writeFile(path.join(FilePaths.server, 'tsconfig.json'), renderedFile);
};

const generateCoreFiles = (): Promise<void[]> => {
  return Promise.all([generateTSConfigFile()]);
};

export default generateCoreFiles;
