import * as React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import Graph from 'graph-data-structure';
import { ElementTreeNode, Widget, Page } from 'canvas-types';

import { Store, KeyedObject } from '../types/store';

import { WidgetBuilder } from './widget';

const getElements = createSelector<
  Store,
  KeyedObject<Widget>,
  KeyedObject<Page>,
  {
    widgets: KeyedObject<Widget>;
    pages: KeyedObject<Page>;
  }
>(
  (state) => state.widget.config,
  (state) => state.page.config,
  (widgets, pages) => ({ widgets, pages }),
);

export const useBuildTree = (): ElementTreeNode[] => {
  const { widgets, pages } = useSelector(getElements);

  const all = { ...pages, ...widgets };

  const elementGraph = Graph();
  Object.keys(all).forEach((k) => elementGraph.addNode(k));
  Object.values(widgets).forEach((v) => elementGraph.addEdge(v.parent, v.id));

  const buildTree = (node: string): ElementTreeNode => {
    const element = all[node];
    const children = elementGraph.adjacent(node);
    return {
      id: element.id,
      name: element.name,
      type: element.type,
      position: element.type === 'page' ? 0 : element.position,
      children: children
        .map(buildTree)
        .sort((a: ElementTreeNode, b: ElementTreeNode) => (a.position > b.position ? 1 : -1)),
      element,
    };
  };

  const elementTree: ElementTreeNode[] = Object.keys(pages).map(buildTree);

  return elementTree;
};

export const useChildrenMap = (nodeId: string): React.FunctionComponentElement<any>[] => {
  const [childrenMap, setChildrenMap] = React.useState<
    Record<string, React.FunctionComponentElement<any>>
  >({});

  const { widgets } = useSelector(getElements);
  const all = { ...widgets };
  const children = Object.values(all).filter((el) => el.parent === nodeId);

  React.useEffect(() => {
    setChildrenMap(() => {
      return children.reduce((acc, cur) => {
        if (childrenMap[cur.id]) {
          return { ...acc, [cur.id]: childrenMap[cur.id] };
        }
        return {
          ...acc,
          [cur.id]: React.createElement(React.memo(WidgetBuilder), {
            key: `widget-builder-${cur.id}`,
            widgetId: cur.id,
          }),
        };
      }, {});
    });
  }, [JSON.stringify(children)]);

  return children.sort((a, b) => (a.position > b.position ? 1 : -1)).map((c) => childrenMap[c.id]);
};
