import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  GridLayout,
  Layout,
  Widget,
  IGridStyle,
  TGridStyleLayout,
  GridAlignment,
} from 'canvas-types';
import { Store } from 'types/store';
import { makeGetUsedGridSpace } from 'selectors/element';
import { GridPreview } from 'components/Grid/GridPreview';
import { updateLayoutStyle } from 'actions/layout';
import { updateWidgetStyle } from 'actions/widget';
import { GridAlignmentConfig } from 'components/Grid/GridAlignmentConfig';

import * as Styles from './GridParentStyle.styles';

interface IGridParentStyle {
  element: Layout | Widget;
  parent: GridLayout;
}

export const GridParentStyle = ({ element, parent }: IGridParentStyle): JSX.Element => {
  const dispatch = useDispatch();
  const getUsedGridSpace = React.useMemo(makeGetUsedGridSpace, []);
  const usedGridSpace = useSelector((state: Store) =>
    getUsedGridSpace(state, parent.id, [element.id]),
  );

  if (element.style.type !== 'grid') throw Error();

  const handleSelectGrid = (grid: TGridStyleLayout) => {
    if (element.style.type !== 'grid') throw Error();

    const style: IGridStyle = {
      ...element.style,
      layout: grid,
    };

    if (element.type === 'widget') {
      dispatch(updateWidgetStyle(element.id, style));
    }

    if (element.type === 'layout') {
      dispatch(updateLayoutStyle(element.id, style));
    }
  };

  const handleUpdateRowAlignment = (alignment: GridAlignment) => {
    if (element.style.type !== 'grid') throw Error();

    const style: IGridStyle = {
      ...element.style,
      rowAlignment: alignment,
    };

    if (element.type === 'widget') {
      dispatch(updateWidgetStyle(element.id, style));
    }

    if (element.type === 'layout') {
      dispatch(updateLayoutStyle(element.id, style));
    }
  };

  const handleUpdateColumnAlignment = (alignment: GridAlignment) => {
    if (element.style.type !== 'grid') throw Error();

    const style: IGridStyle = {
      ...element.style,
      columnAlignment: alignment,
    };

    if (element.type === 'widget') {
      dispatch(updateWidgetStyle(element.id, style));
    }

    if (element.type === 'layout') {
      dispatch(updateLayoutStyle(element.id, style));
    }
  };

  return (
    <Styles.Container>
      <GridPreview
        columns={parent?.props?.columns ?? []}
        rows={parent?.props?.rows ?? []}
        selectedGrid={element.style.type === 'grid' ? element.style.layout : undefined}
        selectGrid={handleSelectGrid}
        usedGridSpace={usedGridSpace}
      />
      <GridAlignmentConfig
        name="row"
        alignment={element.style.rowAlignment}
        updateAlignment={handleUpdateRowAlignment}
      />
      <GridAlignmentConfig
        name="column"
        alignment={element.style.columnAlignment}
        updateAlignment={handleUpdateColumnAlignment}
      />
    </Styles.Container>
  );
};
