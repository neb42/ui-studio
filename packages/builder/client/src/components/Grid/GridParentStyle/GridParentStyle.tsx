import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Widget,
  IGridStyle,
  TGridStyleLayout,
  GridAlignment,
  CustomComponentInstance,
} from '@ui-studio/types';
import { updateStyle } from 'actions/styles';
import { getUsedGridSpaceForSelectedElement } from 'selectors/grid';
import { GridPreview } from 'components/Grid/GridPreview';
import { GridAlignmentConfig } from 'components/Grid/GridAlignmentConfig';

import * as Styles from './GridParentStyle.styles';

interface IGridParentStyle {
  element: Widget | CustomComponentInstance;
  parent: Widget | CustomComponentInstance;
}

export const GridParentStyle = ({ element, parent }: IGridParentStyle): JSX.Element => {
  const dispatch = useDispatch();
  const usedGridSpace = useSelector(getUsedGridSpaceForSelectedElement);

  if (element.style.type !== 'grid') throw Error();
  if (parent.layout?.type !== 'grid') throw Error();

  const handleSelectGrid = (grid: TGridStyleLayout) => {
    if (element.style.type !== 'grid') throw Error();

    const style: IGridStyle = {
      ...element.style,
      layout: grid,
    };

    dispatch(updateStyle(style));
  };

  const handleUpdateRowAlignment = (alignment: GridAlignment) => {
    if (element.style.type !== 'grid') throw Error();

    const style: IGridStyle = {
      ...element.style,
      rowAlignment: alignment,
    };

    dispatch(updateStyle(style));
  };

  const handleUpdateColumnAlignment = (alignment: GridAlignment) => {
    if (element.style.type !== 'grid') throw Error();

    const style: IGridStyle = {
      ...element.style,
      columnAlignment: alignment,
    };

    dispatch(updateStyle(style));
  };

  return (
    <Styles.Container>
      <GridPreview
        columns={parent?.layout?.columns ?? []}
        rows={parent?.layout?.rows ?? []}
        selectedGrid={element.style.type === 'grid' ? element.style.layout : undefined}
        selectGrid={handleSelectGrid}
        usedGridSpace={usedGridSpace}
      />
      <GridAlignmentConfig
        self
        name="row"
        alignment={element.style.rowAlignment}
        updateAlignment={handleUpdateRowAlignment}
      />
      <GridAlignmentConfig
        self
        name="column"
        alignment={element.style.columnAlignment}
        updateAlignment={handleUpdateColumnAlignment}
      />
    </Styles.Container>
  );
};
