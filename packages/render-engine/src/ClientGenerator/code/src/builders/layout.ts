import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Layout } from 'canvas-types';

import { Store } from '../types/store';
import { updateHoverElement, updateSelectedElement } from '../actions/development';

import { useChildrenMap } from './tree';

const LayoutWrapper = styled.div<{ layout: Layout; isSelected: boolean }>`
  ${({ layout }) =>
    layout.layoutType === 'grid'
      ? `
        display: grid;
        grid-template-columns: ${layout.props.columns
          .map((l) => `${l.value || ''}${l.unit}`)
          .join(' ')};
        grid-template-rows: ${layout.props.rows.map((l) => `${l.value || ''}${l.unit}`).join(' ')};
        grid-column-gap: ${layout.props.columnGap}px;
        grid-row-gap: ${layout.props.rowGap}px;
        align-items: ${layout.props.rowAlignment};
        justify-content: ${layout.props.columnAlignment};
      `
      : ''}

  ${({ layout }) =>
    layout.layoutType === 'flex'
      ? `
        display: flex;
        flex-direction: ${layout.props.direction};
        align-items: ${layout.props.align};
        justify-content: ${layout.props.justify};
        flex-wrap: ${layout.props.wrap ? 'wrap' : 'no-wrap'};
      `
      : ''}

  ${({ layout }) =>
    layout.style.type === 'grid'
      ? `
        grid-row: ${layout.style.layout[0][0]} / ${layout.style.layout[1][0] + 1};
        grid-column: ${layout.style.layout[0][1]} / ${layout.style.layout[1][1] + 1};
      `
      : ''}

  ${({ layout }) =>
    layout.style.type === 'flex'
      ? `
        align-self: ${layout.style.align};
        justify-self: ${layout.style.justify};
        flex-grow: ${layout.style.grow};
      `
      : ''}

  ${({ layout }) => layout.style.css}

  ${({ theme, isSelected }) => (isSelected ? `border: 1px solid ${theme.colors.brand500};` : '')}
`;

export const LayoutBuilder: React.FC<any> = ({ layoutId }: { layoutId: string }) => {
  const dispatch = useDispatch();
  const layout = useSelector((state: Store) => state.layout.config[layoutId]);
  const selectedElementId = useSelector((state: Store) => state.development.selectedElement);
  const hoverElementId = useSelector((state: Store) => state.development.hoverElement);

  const isSelected = useSelector(
    (state: Store) =>
      state.development.selectedElement === layout.id ||
      state.development.hoverElement === layout.id,
  );

  const children = useChildrenMap(layoutId);

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (selectedElementId !== layoutId) {
      event.stopPropagation();
      dispatch(updateSelectedElement(layoutId));
    }
  };
  const handleOnMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (hoverElementId !== layoutId) {
      event.stopPropagation();
      dispatch(updateHoverElement(layoutId));
    }
  };

  return React.createElement(
    LayoutWrapper,
    {
      key: `layout-wrapper-${layout.id}`,
      className: layout.style.classNames,
      // onClick: handleOnClick,
      // onMouseMove: handleOnMouseMove,
      layout,
      isSelected,
    },
    children,
  );
};
