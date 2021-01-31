import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Alignment, IGridCell, Page, Layout, Widget } from '@ui-builder/types';
import { updateLayoutConfig } from 'actions/layout';
import { GridPreview } from 'components/Grid/GridPreview';
import { GridTemplateControls } from 'components/Grid/GridTemplateControls';
import { GridGap } from 'components/Grid/GridGap';
import { AlignmentConfig } from 'components/AlignmentConfig';

import * as Styles from './GridLayoutConfig.styles';

interface IGridLayoutConfig {
  element: Page | Layout | Widget;
}

export const GridLayoutConfig = ({ element }: IGridLayoutConfig): JSX.Element => {
  const dispatch = useDispatch();

  const handleUpdateRows = (rows: IGridCell[]) =>
    dispatch(updateLayoutConfig(element.id, 'rows', rows));

  const handleUpdateColumns = (columns: IGridCell[]) =>
    dispatch(updateLayoutConfig(element.id, 'columns', columns));

  const handleUpdateColumnGap = (gap: number) =>
    dispatch(updateLayoutConfig(element.id, 'columnGap', gap));

  const handleUpdateRowGap = (gap: number) =>
    dispatch(updateLayoutConfig(element.id, 'rowGap', gap));

  const handleUpdateColumnAlignment = (alignment: Alignment) =>
    dispatch(updateLayoutConfig(element.id, 'columnAlignment', alignment));

  const handleUpdateRowAlignment = (alignment: Alignment) =>
    dispatch(updateLayoutConfig(element.id, 'rowAlignment', alignment));

  return (
    <Styles.Container>
      <GridPreview columns={element.props.columns} rows={element.props.rows} />
      <GridTemplateControls
        name="column"
        config={element.props.columns}
        updateConfig={handleUpdateColumns}
      />
      <GridTemplateControls
        name="row"
        config={element.props.rows}
        updateConfig={handleUpdateRows}
      />
      <GridGap name="column" gap={element.props.columnGap} updateGap={handleUpdateColumnGap} />
      <GridGap name="row" gap={element.props.rowGap} updateGap={handleUpdateRowGap} />
      <AlignmentConfig
        name="column"
        alignment={element.props.columnAlignment}
        updateAlignment={handleUpdateColumnAlignment}
      />
      <AlignmentConfig
        name="row"
        alignment={element.props.rowAlignment}
        updateAlignment={handleUpdateRowAlignment}
      />
    </Styles.Container>
  );
};
