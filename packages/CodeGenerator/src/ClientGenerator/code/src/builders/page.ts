import * as React from 'react';
import styled from 'styled-components';
import { Page, Widget, Layout } from '@ui-builder/types';

import { KeyedObject } from '../types/store';
import { TreeNode } from '../types/tree';

import { WidgetBuilder } from './widget';
import { LayoutBuilder } from './layout';

export const PageBuilder = ({
  page,
  widgets,
  layouts,
  pageNode,
}: {
  page: Page;
  widgets: KeyedObject<Widget>;
  layouts: KeyedObject<Layout>;
  pageNode: TreeNode;
}): React.ReactElement<any> => {
  const makeElement = (node: TreeNode): React.ReactNode => {
    if (node.type === 'widget')
      return React.createElement(
        WidgetBuilder,
        { widget: widgets[node.id] },
        node.children.map(makeElement),
      );

    if (node.type === 'layout')
      return React.createElement(
        LayoutBuilder,
        { layout: layouts[node.id] },
        node.children.map(makeElement),
      );

    throw Error();
  };

  const PageWrapper = styled.div`
    height: 100%;
    width: 100%;

    ${page.style.css}
  `;

  return React.createElement(
    PageWrapper,
    { className: page.style.classNames },
    pageNode.children.map(makeElement),
  );
};
