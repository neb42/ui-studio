import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GridLayout, Layout, Widget, IGridStyle, TGridStyleLayout } from '@ui-builder/types';
import { Store } from 'types/store';
import { makeGetUsedGridSpace } from 'selectors/element';
import { GridPreview } from 'components/Grid/GridPreview';
import { updateLayoutStyle } from 'actions/layout';
import { updateWidgetStyle } from 'actions/widget';

import * as Styles from './GridParentStyle.styles';

interface IGridParentStyle {
  element: Layout | Widget;
  parent: GridLayout;
}

export const GridParentStyle = ({ element, parent }: IGridParentStyle): JSX.Element => {
  const dispatch = useDispatch();
  const getUsedGridSpace = React.useMemo(makeGetUsedGridSpace, []);
  const usedGridSpace = useSelector((state: Store) =>
    getUsedGridSpace(state, parent.name, [element.name]),
  );

  const handleSelectGrid = (grid: TGridStyleLayout) => {
    const style: IGridStyle = {
      type: 'grid',
      layout: grid,
      css: element.style.css,
    };

    if (element.type === 'widget') {
      dispatch(updateWidgetStyle(element.name, style));
    }

    if (element.type === 'layout') {
      dispatch(updateLayoutStyle(element.name, style));
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
    </Styles.Container>
  );
};
