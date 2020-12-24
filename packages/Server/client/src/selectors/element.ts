import { createSelector, OutputParametricSelector } from 'reselect';
import Graph from 'graph-data-structure';
import { ElementTreeNode, InitFunctions } from '@ui-builder/types';
import {
  Store,
  Store$Page,
  Store$Layout,
  Store$Widget,
  IComponent,
  Store$Overlay,
  Store$Variable,
} from 'types/store';

export const getPages = (state: Store): Store$Page => state.page;
export const getOverlays = (state: Store): Store$Overlay => state.overlay;
export const getLayouts = (state: Store): Store$Layout => state.layout;
export const getWidgets = (state: Store): Store$Widget => state.widget;
export const getVariables = (state: Store): Store$Variable => state.variable;
export const getSelectedElementId = (state: Store): string | null => state.element.selectedElement;
export const getSelectedPageId = (state: Store): string | null => state.element.selectedPage;
export const getSelectedOverlayId = (state: Store): string | null => state.element.selectedOverlay;
export const getSelectedVariableId = (state: Store): string | null =>
  state.element.selectedVariable;

export const makeGetElementTree = (): OutputParametricSelector<
  Store,
  string,
  ElementTreeNode | null,
  (
    pageId: string,
    pages: Store$Page,
    layouts: Store$Layout,
    widgets: Store$Widget,
  ) => ElementTreeNode | null
> =>
  createSelector(
    (_: Store, pageId: string) => pageId,
    getPages,
    getLayouts,
    getWidgets,
    (pageId, pages, layouts, widgets) => {
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
          position: element.type === 'page' ? 0 : element.position,
          element,
          children: children.map(buildTree),
        };
      };

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

export const makeGetElement = () =>
  createSelector(
    (_: Store, elementId: string | null) => elementId,
    getPages,
    getLayouts,
    getWidgets,
    (elementId, pages, layouts, widgets) => {
      if (!elementId) return null;
      if (elementId in pages) return pages[elementId];
      if (elementId in layouts) return layouts[elementId];
      if (elementId in widgets) return widgets[elementId];
      return null;
    },
  );

export const makeGetElements = () =>
  createSelector(getPages, getLayouts, getWidgets, (pages, layouts, widgets) => {
    return {
      pages,
      layouts,
      widgets,
    };
  });

export const makeGetUsedGridSpace = () =>
  createSelector(
    (_: Store, gridElementId: string, ignoreNames: string[]) => ({ gridElementId, ignoreNames }),
    getLayouts,
    getWidgets,
    ({ gridElementId, ignoreNames }, layouts, widgets) => {
      const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
        return value !== null && value !== undefined;
      };
      const grid = layouts[gridElementId];
      return [...Object.values(layouts), ...Object.values(widgets)]
        .filter((e) => e.parent === grid.id && !ignoreNames.includes(e.id))
        .map((e) => {
          if (e.style.type === 'grid') return e.style.layout;
          return null;
        })
        .filter(notEmpty);
    },
  );

export const makeGenerateDefaultName = () =>
  createSelector(
    (_: Store, regex: string) => regex,
    getPages,
    getLayouts,
    getWidgets,
    (regex, pages, layouts, widgets) => {
      const pattern = new RegExp(`${regex}([0-9]*)`);
      const names = Object.values({ ...pages, ...layouts, ...widgets }).map((e) => e.name);
      const matchingNames = names.filter((n) => pattern.test(n));
      const indicies = matchingNames.map((n) => pattern.exec(n)?.[1]).filter((n) => n);
      return `${regex}${
        indicies.length === 0 ? 1 : Math.max(...indicies.map((n) => Number(n))) + 1
      }`;
    },
  );

export const makeGetNextPosition = () =>
  createSelector(
    (_: Store, parentId: string) => parentId,
    getLayouts,
    getWidgets,
    (parentId, layouts, widgets) => {
      return [...Object.values(layouts), ...Object.values(widgets)].filter(
        (l) => l.parent === parentId,
      ).length;
    },
  );

export const makeGetComponents = () => (state: Store): IComponent[] => state.element.components;

export const makeGetFunctions = () => (state: Store): InitFunctions[] => state.element.functions;

export const makeGetSelectedVariable = () =>
  createSelector(getSelectedVariableId, getVariables, (selectedVariableId, variables) =>
    selectedVariableId ? variables[selectedVariableId] : null,
  );
