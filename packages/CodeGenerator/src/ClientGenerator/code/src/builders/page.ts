import * as React from 'react';
import styled from 'styled-components';
import { Page, Widget, Layout } from '@ui-builder/types';

import { KeyedObject } from '../types/store';
import { TreeNode } from '../types/tree';

import { buildWidget } from './widget';
import { buildLayout } from './layout';

export const buildPage = (
  page: Page,
  widgets: KeyedObject<Widget>,
  layouts: KeyedObject<Layout>,
  pageNode: TreeNode,
): React.FC<any> => {
  const makeElement = (node: TreeNode): React.ReactNode => {
    const element = (() => {
      if (node.type === 'widget') return buildWidget(widgets[node.id]);
      if (node.type === 'layout') return buildLayout(layouts[node.id]);
      throw Error();
    })();

    return React.createElement(element, {}, node.children.map(makeElement));
  };

  const P: React.FC = () => {
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

  return P;
};
