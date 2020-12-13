import { promises as fs } from 'fs';
import * as path from 'path';

import { Widget, Layout, Page, ElementTreeNode } from '@ui-builder/types';

import { FilePaths } from '../FilePaths';
import { makeName } from '../helpers';

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
  source: string;
  dev: boolean;
}

interface IRemoveExcessFiles {
  widgets: Widget[];
  pages: Page[];
  layouts: Layout[];
}

const removeExcessFiles = async ({ widgets, layouts, pages }: IRemoveExcessFiles) => {
  const componentNames = [
    ...widgets.map((w) => makeName(w.name, w.id, true)),
    ...layouts.map((l) => makeName(l.name, l.id, true)),
  ];
  const componentFiles = await fs.readdir(FilePaths.components);
  await Promise.all(
    componentFiles
      .filter((c) => !componentNames.includes(c))
      .map((c) => fs.unlink(path.join(FilePaths.components, c))),
  );

  const pageNames = pages.map((p) => makeName(p.name, p.id, true));
  const pageFiles = await fs.readdir(FilePaths.pages);
  await Promise.all(
    pageFiles
      .filter((p) => !pageNames.includes(p))
      .map((p) => fs.unlink(path.join(FilePaths.pages, p))),
  );
};

const generateClient = async ({ elementTree, widgets, pages, layouts, source, dev }: Args) => {
  return Promise.all([
    generateLayoutFiles(layouts),
    generatePageFiles(elementTree),
    generateReducerFiles(widgets),
    generateRoutesFile(pages),
    generateSubscriberFiles(),
    generateWidgetFiles(widgets),
    generateSelectorFiles(),
    generateActionFiles(),
    generateCoreFiles(source, dev),
    removeExcessFiles({ widgets, pages, layouts }),
  ]);
};

export default generateClient;
