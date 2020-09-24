import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';
import { ElementTreeNode } from '@ui-builder/types';

import { FilePaths } from '../FilePaths';

const generatePageFiles = (elementTree: ElementTreeNode[]): Promise<void[]> => {
  return Promise.all(
    elementTree.map(async (e) => {
      const [data, recursiveImport, recursiveElement] = await Promise.all([
        fs.readFile(path.join(__dirname, 'templates', 'Page.mst')),
        fs.readFile(path.join(__dirname, 'templates', 'RecursiveImport.mst')),
        fs.readFile(path.join(__dirname, 'templates', 'RecursiveElement.mst')),
      ]);
      const renderedFile = Mustache.render(
        data.toString(),
        {
          name: e.name.replace(' ', '_'),
          type: e.type,
          children: e.children,
        },
        {
          recursive_import: recursiveImport.toString(),
          recursive_element: recursiveElement.toString(),
        },
      );
      return fs.writeFile(path.join(FilePaths.pages, `${e.name}.js`), renderedFile);
    }),
  );
};

export default generatePageFiles;
