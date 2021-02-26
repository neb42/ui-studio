import * as React from 'react';
import { useDispatch } from 'react-redux';
import { GridAlignment, IGridCell, Layout } from 'canvas-types';
import { updateLayoutConfig } from 'actions/layout';
import { GridPreview } from 'components/Grid/GridPreview';
import { GridTemplateControls } from 'components/Grid/GridTemplateControls';
import { GridGap } from 'components/Grid/GridGap';
import { GridAlignmentConfig } from 'components/Grid/GridAlignmentConfig';

import * as Styles from './GridLayoutConfig.styles';

interface IGridLayoutConfig {
  layout: Layout;
}

export const GridLayoutConfig = ({ layout }: IGridLayoutConfig): JSX.Element => {
  const dispatch = useDispatch();

  if (layout.layoutType !== 'grid') throw Error();

  const handleUpdateRows = (rows: IGridCell[]) =>
    dispatch(updateLayoutConfig(layout.id, 'rows', rows));

  const handleUpdateColumns = (columns: IGridCell[]) =>
    dispatch(updateLayoutConfig(layout.id, 'columns', columns));

  const handleUpdateColumnGap = (gap: number) =>
    dispatch(updateLayoutConfig(layout.id, 'columnGap', gap));

  const handleUpdateRowGap = (gap: number) =>
    dispatch(updateLayoutConfig(layout.id, 'rowGap', gap));

  const handleUpdateColumnAlignment = (alignment: GridAlignment) =>
    dispatch(updateLayoutConfig(layout.id, 'columnAlignment', alignment));

  const handleUpdateRowAlignment = (alignment: GridAlignment) =>
    dispatch(updateLayoutConfig(layout.id, 'rowAlignment', alignment));

  return (
    <Styles.Container>
      <GridPreview columns={layout.props.columns} rows={layout.props.rows} />
      <GridTemplateControls
        name="column"
        config={layout.props.columns}
        updateConfig={handleUpdateColumns}
      />
      <GridTemplateControls name="row" config={layout.props.rows} updateConfig={handleUpdateRows} />
      <GridGap name="column" gap={layout.props.columnGap} updateGap={handleUpdateColumnGap} />
      <GridGap name="row" gap={layout.props.rowGap} updateGap={handleUpdateRowGap} />
      <GridAlignmentConfig
        name="column"
        alignment={layout.props.columnAlignment}
        updateAlignment={handleUpdateColumnAlignment}
      />
      <GridAlignmentConfig
        name="row"
        alignment={layout.props.rowAlignment}
        updateAlignment={handleUpdateRowAlignment}
      />
      <div style={{ height: 100 }} />
    </Styles.Container>
  );
};
