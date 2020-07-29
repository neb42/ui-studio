import { promises as fs, existsSync } from 'fs';
import * as path from 'path';

import generateLayoutFiles from './layout';
import generateReducerFiles from './reducers';
import generatePageFiles from './page';
import generateRoutesFile from './routes';
import generateSubscriberFiles from './subscribers';
import generateWidgetFiles from './widget';
import generateSelectorFiles from './selector';

interface Args {
  elementTree: ElementTree[];
  queries: Query[];
  serverFunctions: ServerFunction[];
  clientFunctions: ClientFunction[];
  widgets: Widget[];
  pages: Page[];
  layouts: Layout[];
  getChildrenOfTypes: (nodeKey: string, types: string[]) => string[];
  basePath: string;
}

const generateClient = async ({
  elementTree,
  queries,
  serverFunctions,
  clientFunctions,
  widgets,
  pages,
  layouts,
  getChildrenOfTypes,
  basePath,
}: Args) => {
  const clientPath = path.join(basePath, 'client');
  const componentsPath = path.join(clientPath, 'components');
  const reducersPath = path.join(clientPath, 'reducers');
  const pagesPath = path.join(clientPath, 'pages');
  const subscribersPath = path.join(clientPath, 'subscribers');
  const selectorsPath = path.join(clientPath, 'selectors');

  if (!existsSync(clientPath)){
    await fs.mkdir(clientPath);
  }
  if (!existsSync(componentsPath)){
    await fs.mkdir(componentsPath);
  }
  if (!existsSync(reducersPath)){
    await fs.mkdir(reducersPath);
  }
  if (!existsSync(pagesPath)){
    await fs.mkdir(pagesPath);
  }
  if (!existsSync(subscribersPath)){
    await fs.mkdir(subscribersPath);
  }
  if (!existsSync(selectorsPath)){
    await fs.mkdir(selectorsPath);
  }

  return Promise.all([
    generateLayoutFiles(layouts, componentsPath),
    generatePageFiles(elementTree, pagesPath),
    generateReducerFiles(widgets, clientFunctions, reducersPath, getChildrenOfTypes),
    generateRoutesFile(pages, pagesPath),
    generateSubscriberFiles([...clientFunctions, ...widgets], subscribersPath, getChildrenOfTypes),
    generateWidgetFiles(widgets, componentsPath),
    generateSelectorFiles(widgets, clientFunctions, selectorsPath, getChildrenOfTypes),
  ]);
};

export default generateClient;