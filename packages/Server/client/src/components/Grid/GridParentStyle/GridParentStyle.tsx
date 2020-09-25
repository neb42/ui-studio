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

  const handleOnClick = (row: number, col: number) => {
    const gridLayout = ((): [[number, number], [number, number]] => {
      if (element.style.type !== 'grid') throw Error();

      if (row === 0 && col === 0) {
        return [
          [0, 0],
          [0, 0],
        ];
      }

      const currentTopLeft = element.style.layout[0];
      const currentBottomRight = element.style.layout[1];

      const checkGridOverlap = (grid: [[number, number], [number, number]]) =>
        usedGridSpace.some(
          (compare) =>
            !(
              // grid right left of compare left
              (
                grid[1][0] < compare[0][0] ||
                // grid left right of compare right
                grid[0][0] > compare[1][0] ||
                // grid bottom above compare top
                grid[1][1] < compare[0][1] ||
                // grid top below compare bottom
                grid[0][1] > compare[1][1]
              )
            ),
        );

      const pythag = (d1: [number, number], d2: [number, number]) => {
        const a = d1[0] - d2[0];
        const b = d1[1] - d2[1];
        return Math.sqrt(a * a + b * b);
      };

      const topLeftDist = pythag([row, col], currentTopLeft);
      const bottomRightDist = pythag([row, col], currentBottomRight);

      const newGrid = ((): [[number, number], [number, number]] => {
        if (
          JSON.stringify(element.style.layout) ===
          JSON.stringify([
            [0, 0],
            [0, 0],
          ])
        )
          return [
            [row, col],
            [row, col],
          ];

        if (row < currentTopLeft[0] || col < currentTopLeft[1])
          return [[row, col], currentBottomRight];
        return [currentTopLeft, [row, col]];
      })();

      if (checkGridOverlap(newGrid)) {
        return [
          [row, col],
          [row, col],
        ];
      }

      return newGrid;
    })();

    const style: IGridStyle = {
      type: 'grid',
      layout: gridLayout,
    };

    if (element.type === 'widget') {
      dispatch(updateWidgetStyle(element.name, style));
    }

    if (element.type === 'layout') {
      dispatch(updateLayoutStyle(element.name, style));
    }
  };

  const handleSelectGrid = (grid: TGridStyleLayout) => {
    const style: IGridStyle = {
      type: 'grid',
      layout: grid,
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
