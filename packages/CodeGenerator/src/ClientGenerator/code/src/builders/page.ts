import * as React from 'react';
import styled from 'styled-components';
import { ElementTreeNode } from '@ui-builder/types';

import { WidgetBuilder } from './widget';
import { LayoutBuilder } from './layout';

export const PageBuilder = ({
  pageNode,
}: {
  pageNode: ElementTreeNode;
}): React.ReactElement<any> => {
  if (pageNode.element.type !== 'page') throw Error();

  const makeElement = (node: ElementTreeNode): React.ReactNode => {
    if (node.type === 'widget' && node.element.type === 'widget')
      return React.createElement(
        WidgetBuilder,
        { widget: node.element },
        node.children.map(makeElement),
      );

    if (node.type === 'layout' && node.element.type === 'layout')
      return React.createElement(
        LayoutBuilder,
        { layout: node.element },
        node.children.map(makeElement),
      );

    throw Error();
  };

  const PageWrapper = styled.div`
    height: 100%;
    width: 100%;

    ${pageNode.element.style.css}
  `;

  return React.createElement(
    PageWrapper,
    { className: pageNode.element.style.classNames },
    pageNode.children.map(makeElement),
  );
};
