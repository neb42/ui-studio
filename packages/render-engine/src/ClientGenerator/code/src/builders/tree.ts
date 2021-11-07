import * as React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { Widget, Page, CustomComponent, CustomComponentInstance } from '@ui-studio/types';

import { Store, KeyedObject } from '../types/store';

import { WidgetBuilder } from './widget';

const getElements = createSelector<
  Store,
  KeyedObject<Widget | CustomComponentInstance>,
  KeyedObject<Page | CustomComponent>,
  {
    widgets: KeyedObject<Widget | CustomComponentInstance>;
    pages: KeyedObject<Page | CustomComponent>;
  }
>(
  (state) => state.widget.config,
  (state) => state.root.config,
  (widgets, pages) => ({ widgets, pages }),
);

export const useChildrenMap = (
  nodeId: string,
  rootId: string | null = null,
  iteratorIndex = {},
): React.FunctionComponentElement<any>[] => {
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
            rootId,
            iteratorIndex,
          }),
        };
      }, {});
    });
  }, [JSON.stringify(children)]);

  return children
    .sort((a, b) => (a.position > b.position ? 1 : -1))
    .map((c) => childrenMap[c.id])
    .filter((c) => c);
};
