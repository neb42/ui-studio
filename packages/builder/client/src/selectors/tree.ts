import {
  Page,
  CustomComponent,
  Widget,
  Component,
  Element,
  CustomComponentInstance,
} from '@ui-studio/types';
import { TreeItem } from '@atlaskit/tree';
import { getComponents } from 'selectors/configuration';
import { getSelectedRootId, getSelectedElementId } from 'selectors/view';
import { Store } from 'types/store';

export const getRawTree = (state: Store): Store['tree'] => state.tree;

export const getRoots = (state: Store): (Page | CustomComponent)[] =>
  Object.values(state.tree).map((t) => t.root);

export const getWidgetsForRoot = (
  state: Store,
  rootId: string,
): (Widget | CustomComponentInstance)[] => Object.values(state.tree[rootId].widgets);

export const getWidgetsInSelectedTree = (state: Store): (Widget | CustomComponentInstance)[] => {
  const rootId = getSelectedRootId(state);
  if (!rootId) return [];
  return getWidgetsForRoot(state, rootId);
};

export const getSelectedRootElement = (state: Store): Page | CustomComponent | null => {
  const rootId = getSelectedRootId(state);
  if (!rootId) return null;
  return state.tree[rootId].root;
};

export const getSelectedElement = (state: Store): Element | null => {
  const rootId = getSelectedRootId(state);
  const selectedElementId = getSelectedElementId(state);
  if (!rootId || !selectedElementId) return null;
  const tree = state.tree[rootId];
  if (rootId === selectedElementId) return tree.root;
  return tree.widgets[selectedElementId];
};

export const getTreeForRoot = (state: Store, rootId: string): Record<string, TreeItem> => {
  const { root, widgets } = state.tree[rootId];
  const all = {
    [rootId]: root,
    ...widgets,
  };

  const components = getComponents(state);

  const componentMap = components.reduce<Record<string, Component>>(
    (acc, cur) => ({ ...acc, [cur.name]: cur }),
    {},
  );

  const tree: Record<string, TreeItem> = Object.keys(all).reduce((acc, cur) => {
    const element = all[cur];
    return {
      ...acc,
      [cur]: {
        id: cur,
        children: [],
        hasChildren:
          (element.type !== 'widget' || componentMap[element.component]?.hasChildren) ?? true,
        data: {
          name: element.name,
          type: element.type,
          element,
        },
      },
    };
  }, {});

  Object.values(all).forEach((el) => {
    if (!el.rootElement) {
      if (el.parent && tree[el.parent]) {
        tree[el.parent].children = [...tree[el.parent].children, el.id];
      }
    }
  });

  Object.keys(tree).forEach((key) => {
    tree[key].children = tree[key].children.sort((a, b) => {
      const posA = tree[a].data.element.position;
      const posB = tree[b].data.element.position;
      if (posA > posB) return 1;
      if (posA < posB) return -1;
      return 0;
    });
  });

  return tree;
};

export const getSelectedTree = (state: Store): Record<string, TreeItem> => {
  const rootId = getSelectedRootId(state);
  if (!rootId) return {};
  return getTreeForRoot(state, rootId);
};

export const getElement = (state: Store, rootId: string, elementId: string): Element | null => {
  const tree = state.tree[rootId];
  if (!rootId) return null;
  if (rootId === elementId) return tree.root;
  return tree.widgets[elementId];
};

export const getParentElement = (
  state: Store,
  rootId: string,
  elementId: string,
): Element | null => {
  const element = getElement(state, rootId, elementId);
  if (!element || element.rootElement) return null;
  return getElement(state, rootId, element.parent);
};

export const getParentElementForSelectedElement = (state: Store): Element | null => {
  const rootId = getSelectedRootId(state);
  const selectedElementId = getSelectedElementId(state);
  if (!rootId || !selectedElementId) return null;
  return getParentElement(state, rootId, selectedElementId);
};
