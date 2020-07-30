import { promises as fs, existsSync } from 'fs';
import * as path from 'path';

import generateLayoutFiles from './layout';
import generateReducerFiles from './reducers';
import generatePageFiles from './page';
import generateRoutesFile from './routes';
import generateSubscriberFiles from './subscribers';
import generateWidgetFiles from './widget';
import generateSelectorFiles from './selector';
import generateCoreFiles from './core';

interface Args {
  appName: string;
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
  appName,
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
  const srcPath = path.join(clientPath, 'src');
  const componentsPath = path.join(srcPath, 'components');
  const reducersPath = path.join(srcPath, 'reducers');
  const pagesPath = path.join(srcPath, 'pages');
  const subscribersPath = path.join(srcPath, 'subscribers');
  const selectorsPath = path.join(srcPath, 'selectors');
  const publicPath = path.join(clientPath, 'public');

  if (!existsSync(clientPath)){
    await fs.mkdir(clientPath);
  }
  if (!existsSync(srcPath)){
    await fs.mkdir(srcPath);
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
  if (!existsSync(publicPath)){
    await fs.mkdir(publicPath);
  }

  return Promise.all([
    generateLayoutFiles(layouts, componentsPath),
    generatePageFiles(elementTree, pagesPath),
    generateReducerFiles(widgets, clientFunctions, reducersPath, getChildrenOfTypes),
    generateRoutesFile(pages, srcPath),
    generateSubscriberFiles([...clientFunctions, ...widgets], subscribersPath, getChildrenOfTypes),
    generateWidgetFiles(widgets, componentsPath),
    generateSelectorFiles(widgets, clientFunctions, selectorsPath, getChildrenOfTypes),
    generateCoreFiles(appName, clientPath),
  ]);
};

export default generateClient;