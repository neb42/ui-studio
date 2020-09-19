import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';

import { FilePaths } from '../FilePaths';

const generateActionFiles = async (): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'Actions.mst'));
  const renderedFile = Mustache.render(data.toString(), {});
  return fs.writeFile(path.join(FilePaths.clientSrc, 'actions.js'), renderedFile);
};

export default generateActionFiles;
