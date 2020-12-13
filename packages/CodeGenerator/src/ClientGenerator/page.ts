import { promises as fs } from 'fs';
import * as path from 'path';

import * as Mustache from 'mustache';
import { ElementTreeNode } from '@ui-builder/types';

import { FilePaths } from '../FilePaths';
import { makeName } from '../helpers';

const renameChildren = (children: ElementTreeNode[]): ElementTreeNode[] =>
  children.map((c) => ({
    ...c,
    name: makeName(c.name, c.id),
    children: renameChildren(c.children),
  }));

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
          name: makeName(e.name, e.id),
          type: e.type,
          children: renameChildren(e.children),
        },
        {
          recursive_import: recursiveImport.toString(),
          recursive_element: recursiveElement.toString(),
        },
      );
      return fs.writeFile(path.join(FilePaths.pages, makeName(e.name, e.id, true)), renderedFile);
    }),
  );
};

export default generatePageFiles;
