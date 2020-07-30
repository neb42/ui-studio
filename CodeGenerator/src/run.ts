import { promises as fs, existsSync } from 'fs';
import Graph from 'graph-data-structure';

import generateServer from './ServerGenerator/generateServer';
import generateClient from './ClientGenerator/generateClient';

import * as FakeData from './fakeData';

const basePath = '/Users/bmcalindin/Desktop/generatedCode';

const run = async (appId: string) => {
  / * Get from database */
  const appName = 'my-app';

  const datasets: { [key: string]: Dataset; } = FakeData.dataset;
  const queries: { [key: string]: Query; } = FakeData.queries;
  const serverFunctions: { [key: string]: ServerFunction; } = FakeData.serverFunctions;
  const clientFunctions: { [key: string]: ClientFunction; } = FakeData.clientFunctions;
  const widgets: { [key: string]: Widget; } = FakeData.widgets;
  const layouts: { [key: string]: Layout; } = FakeData.layouts;
  const pages: { [key: string]: Page; } = FakeData.pages;
  / * Get from database */

  const all = {
    ...datasets,
    ...queries,
    ...serverFunctions,
    ...clientFunctions,
    ...pages,
    ...layouts,
    ...widgets,
  };

  const dependencyGraph = Graph();
  Object.keys(all).forEach(k => dependencyGraph.addNode(k));
  Object.values({
    ...queries,
    ...serverFunctions,
    ...clientFunctions,
    ...widgets,
  }).forEach(v => Object.values(v.dependencies)
    .forEach(depSet => 
      depSet.forEach(d => dependencyGraph.addEdge(v.name, d))
    )
  );

  const elementGraph = Graph();
  Object.keys({ ...pages, ...layouts, ... widgets }).forEach(k => elementGraph.addNode(k));
  Object.values({ ...widgets, ...layouts }).forEach(v => elementGraph.addEdge(v.parent, v.name));

  const getChildrenOfTypes = (nodeKey: string, types: string[]): string[] => {
    const allChildren = dependencyGraph.depthFirstSearch([nodeKey], false);
    return allChildren.filter(c => types.includes(all[c].type));
  };

  const buildTree = (node: string) => {
    const element = all[node];
    const children = elementGraph.adjacent(node);
    return {
      name: element.name, 
      type: element.type,
      children: children.map(buildTree),
    };
  };
  const elementTree: ElementTree[] = Object.keys(pages).map(buildTree);

  if (!existsSync(basePath)){
    await fs.mkdir(basePath);
  }

  generateServer({
    appName,
    datasets: Object.values(datasets),
    queries: Object.values(queries),
    serverFunctions: Object.values(serverFunctions),
    clientFunctions: Object.values(clientFunctions),
    widgets: Object.values(widgets),
    getChildrenOfTypes,
    basePath,
  });

  generateClient({
    appName,
    elementTree,
    queries: Object.values(queries),
    serverFunctions: Object.values(serverFunctions),
    clientFunctions: Object.values(clientFunctions),
    widgets: Object.values(widgets),
    pages: Object.values(pages),
    layouts: Object.values(layouts),
    getChildrenOfTypes,
    basePath,
  });

  // buildServer();
  // buildClient();

  // moveClientBundleToServer

  // generateDeploymentFiles
};

try {
  run(process.env.APP_ID);
} catch (error) {
  console.log(error)
}