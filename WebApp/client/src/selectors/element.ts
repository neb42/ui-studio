import { createSelector, OutputParametricSelector } from 'reselect';
import Graph from 'graph-data-structure';
import { ElementTree } from 'types/element';
import { Store, Store$Element$Page, Store$Element$Layout, Store$Element$Widget } from 'types/store';

export const getPages = (state: Store): Store$Element$Page => state.element.pages;
export const getLayouts = (state: Store): Store$Element$Layout => state.element.layouts;
export const getWidgets = (state: Store): Store$Element$Widget => state.element.widgets;

export const makeGetElementTree = (): OutputParametricSelector<
  Store,
  string,
  ElementTree,
  (
    pageName: string,
    pages: Store$Element$Page,
    layouts: Store$Element$Layout,
    widgets: Store$Element$Widget,
  ) => ElementTree
> =>
  createSelector(
    (_: Store, pageName: string) => pageName,
    getPages,
    getLayouts,
    getWidgets,
    (pageName, pages, layouts, widgets) => {
      const all = {
        ...pages,
        ...layouts,
        ...widgets,
      };

      const elementGraph = Graph();
      Object.keys({ ...pages, ...layouts, ...widgets }).forEach((k) => elementGraph.addNode(k));
      Object.values({ ...widgets, ...layouts }).forEach((v) =>
        elementGraph.addEdge(v.parent, v.name),
      );

      const buildTree = (node: string): ElementTree => {
        const element = all[node];
        const children = elementGraph.adjacent(node);
        return {
          name: element.name,
          type: element.type,
          children: children.map(buildTree),
        };
      };

      const elementTree: ElementTree = buildTree(pageName);
      return elementTree;
    },
  );
