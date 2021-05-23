import * as React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Page } from '@ui-studio/types';

import { Store } from '../types/store';
import { updateHoverElement } from '../actions/development';

import { useChildrenMap } from './tree';

const PageWrapper = styled.div<{ page: Page }>`
  height: 100%;
  width: 100%;

  ${({ page }) =>
    page.style.backgroundColor ? `background-color: ${page.style.backgroundColor};` : ''}

  ${({ page }) => page.style.css}
`;

export const PageBuilder = ({ pageId }: { pageId: string }): React.ReactElement<any> => {
  const dispatch = useDispatch();
  const page = useSelector((state: Store) => state.root.config[pageId]);
  const children = useChildrenMap(pageId);

  const handleMouseLeave = () => dispatch(updateHoverElement(null));

  return React.createElement(
    PageWrapper,
    {
      key: `page-wrapper-${page.id}`,
      className: page.style.classNames,
      onMouseLeave: handleMouseLeave,
      page,
    },
    children,
  );
};
