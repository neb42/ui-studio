import * as React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { Store } from '../types/store';

import { useChildrenMap } from './tree';

const PageWrapper = styled.div<{ css: string }>`
  height: 100%;
  width: 100%;

  ${({ css }) => css}
`;

export const PageBuilder = ({ pageId }: { pageId: string }): React.ReactElement<any> => {
  const page = useSelector((state: Store) => state.page.config[pageId]);
  const children = useChildrenMap(pageId);

  return React.createElement(
    PageWrapper,
    { key: `page-wrapper-${page.id}`, className: page.style.classNames, css: page.style.css },
    children,
  );
};
