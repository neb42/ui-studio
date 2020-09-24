import { Widget, Layout, Page, ElementTreeNode } from '@ui-builder/types';

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
  ]);
};

export default generateClient;
