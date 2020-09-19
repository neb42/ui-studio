import { createSelector, OutputParametricSelector } from 'reselect';
import Graph from 'graph-data-structure';
import { ElementTreeNode } from 'types/element';
import { Store, Store$Element$Page, Store$Element$Layout, Store$Element$Widget } from 'types/store';

export const getPages = (state: Store): Store$Element$Page => state.element.page;
export const getLayouts = (state: Store): Store$Element$Layout => state.element.layout;
export const getWidgets = (state: Store): Store$Element$Widget => state.element.widget;
export const getSelectedElementId = (state: Store): string | null => state.element.selectedElement;

export const makeGetElementTree = (): OutputParametricSelector<
  Store,
  string,
  ElementTreeNode | null,
  (
    pageName: string,
    pages: Store$Element$Page,
    layouts: Store$Element$Layout,
    widgets: Store$Element$Widget,
  ) => ElementTreeNode | null
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
        elementGraph.addEdge(v.parent, v.id),
      );

      const buildTree = (node: string): ElementTreeNode => {
        const element = all[node];
        const children = elementGraph.adjacent(node);
        return {
          id: element.id,
          name: element.name,
          type: element.type,
          children: children.map(buildTree),
        };
      };

      const pageId = Object.values(pages).find((p) => p.name === pageName)?.id;
      if (!pageId) return null;
      const elementTree = buildTree(pageId);
      return elementTree;
    },
  );

export const makeGetSelectedElement = () =>
  createSelector(
    getSelectedElementId,
    getPages,
    getLayouts,
    getWidgets,
    (selectedElementId, pages, layouts, widgets) => {
      if (selectedElementId === null) return null;
      if (selectedElementId in pages) return pages[selectedElementId];
      if (selectedElementId in layouts) return layouts[selectedElementId];
      if (selectedElementId in widgets) return widgets[selectedElementId];
      return null;
    },
  );

export const makeGetElements = () =>
  createSelector(getPages, getLayouts, getWidgets, (pages, layouts, widgets) => {
    return {
      pages,
      layouts,
      widgets,
      datasets: {},
      queries: {},
      serverFunctions: {},
      clientFunctions: {},
    };
  });
