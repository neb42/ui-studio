import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';
import { Page } from '@ui-builder/types';

import { FilePaths } from '../FilePaths';

const generateRoutesFile = async (pages: Page[]): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'Routes.mst'));
  const renderedFile = Mustache.render(data.toString(), { pages });
  return fs.writeFile(path.join(FilePaths.clientSrc, 'routes.js'), renderedFile);
};

export default generateRoutesFile;
