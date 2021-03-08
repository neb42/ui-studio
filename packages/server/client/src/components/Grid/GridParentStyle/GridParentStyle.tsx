import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Widget, IGridStyle, TGridStyleLayout, GridAlignment } from 'canvas-types';
import { Store } from 'types/store';
import { makeGetUsedGridSpace } from 'selectors/element';
import { GridPreview } from 'components/Grid/GridPreview';
import { updateWidgetStyle } from 'actions/widget';
import { GridAlignmentConfig } from 'components/Grid/GridAlignmentConfig';

import * as Styles from './GridParentStyle.styles';

interface IGridParentStyle {
  element: Widget;
  parent: Widget;
}

export const GridParentStyle = ({ element, parent }: IGridParentStyle): JSX.Element => {
  const dispatch = useDispatch();
  const getUsedGridSpace = React.useMemo(makeGetUsedGridSpace, []);
  const usedGridSpace = useSelector((state: Store) =>
    getUsedGridSpace(state, parent.id, [element.id]),
  );

  if (element.style.type !== 'grid') throw Error();
  if (parent.layout?.type !== 'grid') throw Error();

  const handleSelectGrid = (grid: TGridStyleLayout) => {
    if (element.style.type !== 'grid') throw Error();

    const style: IGridStyle = {
      ...element.style,
      layout: grid,
    };

    dispatch(updateWidgetStyle(element.id, style));
  };

  const handleUpdateRowAlignment = (alignment: GridAlignment) => {
    if (element.style.type !== 'grid') throw Error();

    const style: IGridStyle = {
      ...element.style,
      rowAlignment: alignment,
    };

    dispatch(updateWidgetStyle(element.id, style));
  };

  const handleUpdateColumnAlignment = (alignment: GridAlignment) => {
    if (element.style.type !== 'grid') throw Error();

    const style: IGridStyle = {
      ...element.style,
      columnAlignment: alignment,
    };

    dispatch(updateWidgetStyle(element.id, style));
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
