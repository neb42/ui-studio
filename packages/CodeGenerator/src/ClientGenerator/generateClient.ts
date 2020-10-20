import { promises as fs } from 'fs';
import * as path from 'path';

import { Widget, Layout, Page, ElementTreeNode } from '@ui-builder/types';

import { FilePaths } from '../FilePaths';

import generateLayoutFiles from './layout';
import generateReducerFiles from './reducers';
import generatePageFiles from './page';
import generateRoutesFile from './routes';
import generateSubscriberFiles from './subscribers';
import generateWidgetFiles from './widget';
import generateSelectorFiles from './selector';
import generateCoreFiles from './core';
import generateActionFiles from './actions';

interface Args {
  elementTree: ElementTreeNode[];
  widgets: Widget[];
  pages: Page[];
  layouts: Layout[];
}

interface IRemoveExcessFiles {
  widgets: Widget[];
  pages: Page[];
  layouts: Layout[];
}

const removeExcessFiles = async ({ widgets, layouts, pages }: IRemoveExcessFiles) => {
  const componentNames = [...widgets.map((w) => w.name), ...layouts.map((l) => `${l.name}.js`)];
  const componentFiles = await fs.readdir(FilePaths.components);
  await Promise.all(
    componentFiles
      .filter((c) => !componentNames.includes(c))
      .map((c) => fs.unlink(path.join(FilePaths.components, c))),
  );

  const pageNames = pages.map((p) => `${p.name}.js`);
  const pageFiles = await fs.readdir(FilePaths.pages);
  await Promise.all(
    pageFiles
      .filter((p) => !pageNames.includes(p))
      .map((p) => fs.unlink(path.join(FilePaths.pages, p))),
  );
};

const generateClient = async ({ elementTree, widgets, pages, layouts }: Args) => {
  return Promise.all([
    generateLayoutFiles(layouts),
    generatePageFiles(elementTree),
    generateReducerFiles(widgets),
    generateRoutesFile(pages),
    generateSubscriberFiles(),
    generateWidgetFiles(widgets),
    generateSelectorFiles(),
    generateActionFiles(),
    generateCoreFiles(),
    removeExcessFiles({ widgets, pages, layouts }),
  ]);
};

export default generateClient;
