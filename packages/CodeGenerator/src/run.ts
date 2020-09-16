import { promises as fs, existsSync } from 'fs';

import Graph from 'graph-data-structure';

import {
  Dataset,
  Query,
  ServerFunction,
  ClientFunction,
  Widget,
  Layout,
  Page,
  ElementTree,
} from './types';
import generateServer from './ServerGenerator/generateServer';
import generateClient from './ClientGenerator/generateClient';
import * as FakeData from './fakeData';

type Data = {
  datasets: { [key: string]: Dataset };
  queries: { [key: string]: Query };
  serverFunctions: { [key: string]: ServerFunction };
  clientFunctions: { [key: string]: ClientFunction };
  widgets: { [key: string]: Widget };
  layouts: { [key: string]: Layout };
  pages: { [key: string]: Page };
};

export const run = async (
  basePath: string,
  appName: string,
  { datasets, queries, serverFunctions, clientFunctions, widgets, layouts, pages }: Data,
) => {
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
  Object.keys(all).forEach((k) => dependencyGraph.addNode(k));
  Object.values({
    ...queries,
    ...serverFunctions,
    ...clientFunctions,
    ...widgets,
  }).forEach((v) =>
    Object.values(v.dependencies).forEach((depSet) =>
      depSet.forEach((d) => dependencyGraph.addEdge(v.name, d)),
    ),
  );

  const elementGraph = Graph();
  Object.keys({ ...pages, ...layouts, ...widgets }).forEach((k) => elementGraph.addNode(k));
  Object.values({ ...widgets, ...layouts }).forEach((v) => elementGraph.addEdge(v.parent, v.name));

  const getChildrenOfTypes = (nodeKey: string, types: string[]): string[] => {
    const allChildren = dependencyGraph.depthFirstSearch([nodeKey], false);
    return Array.from(new Set(allChildren.filter((c) => types.includes(all[c].type))));
  };

  const buildTree = (node: string) => {
    const element = all[node];
    const children = elementGraph.adjacent(node);
    return {
      id: element.id,
      name: element.name,
      type: element.type,
      children: children.map(buildTree),
    };
  };
  const elementTree: ElementTree[] = Object.keys(pages).map(buildTree);

  if (!existsSync(basePath)) {
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

if (typeof require !== 'undefined' && require.main === module) {
  try {
    const basePath = '/Users/bmcalindin/Desktop/generatedCode';
    run(basePath, 'App name', {
      datasets: FakeData.dataset,
      queries: FakeData.queries,
      serverFunctions: FakeData.serverFunctions,
      clientFunctions: FakeData.clientFunctions,
      widgets: FakeData.widgets,
      layouts: FakeData.layouts,
      pages: FakeData.pages,
    });
  } catch (error) {
    console.log(error);
  }
}
