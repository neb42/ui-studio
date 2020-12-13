import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';
import { Page } from '@ui-builder/types';

import { FilePaths } from '../FilePaths';
import { makeName } from '../helpers';

const generateRoutesFile = async (pages: Page[]): Promise<void> => {
  const data = await fs.readFile(path.join(__dirname, 'templates', 'Routes.mst'));
  const renderedFile = Mustache.render(data.toString(), {
    pages: pages.map((p) => ({ ...p, name: makeName(p.name, p.id), route: p.name })),
  });
  return fs.writeFile(path.join(FilePaths.clientSrc, 'routes.js'), renderedFile);
};

export default generateRoutesFile;
