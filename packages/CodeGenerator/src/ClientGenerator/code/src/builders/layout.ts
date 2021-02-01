import * as React from 'react';
import styled from 'styled-components';
import { Layout } from '@ui-builder/types';

export const LayoutBuilder = ({
  layout,
  children,
}: {
  children?: React.ReactNode;
  layout: Layout;
}): React.FunctionComponentElement<any> => {
  const LayoutWrapper: React.FC<any> = styled.div`
    ${layout.layoutType === 'grid'
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

    ${layout.layoutType === 'flex'
      ? `
        display: flex;
        flex-direction: ${layout.props.direction};
        align-items: ${layout.props.align};
        justify-content: ${layout.props.justify};
        flex-wrap: ${layout.props.wrap ? 'wrap' : 'no-wrap'};
      `
      : ''}

      ${layout.style.type === 'grid'
      ? `
        grid-row: ${layout.style.layout[0][0]} / ${layout.style.layout[1][0] + 1};
        grid-column: ${layout.style.layout[0][1]} / ${layout.style.layout[1][1] + 1};
      `
      : ''}

      ${layout.style.type === 'flex'
      ? `
        align-self: ${layout.style.align};
        justify-self: ${layout.style.justify};
        flex-grow: ${layout.style.grow};
      `
      : ''}

      ${layout.style.css}
  `;

  return React.createElement(LayoutWrapper, { className: layout.style.classNames }, children);
};
