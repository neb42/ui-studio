import * as React from 'react';
import { useDispatch } from 'react-redux';
import { GridAlignment, IGridCell, Widget } from 'canvas-types';
import { updateWidgetLayoutConfig } from 'actions/widget';
import { GridPreview } from 'components/Grid/GridPreview';
import { GridTemplateControls } from 'components/Grid/GridTemplateControls';
import { GridGap } from 'components/Grid/GridGap';
import { GridAlignmentConfig } from 'components/Grid/GridAlignmentConfig';

import * as Styles from './GridLayoutConfig.styles';

interface IGridLayoutConfig {
  widget: Widget;
}

export const GridLayoutConfig = ({ widget }: IGridLayoutConfig): JSX.Element => {
  const dispatch = useDispatch();

  if (widget.layout?.type !== 'grid') throw Error();

  const handleUpdateRows = (rows: IGridCell[]) =>
    dispatch(updateWidgetLayoutConfig(widget.id, 'rows', rows));

  const handleUpdateColumns = (columns: IGridCell[]) =>
    dispatch(updateWidgetLayoutConfig(widget.id, 'columns', columns));

  const handleUpdateColumnGap = (gap: number) =>
    dispatch(updateWidgetLayoutConfig(widget.id, 'columnGap', gap));

  const handleUpdateRowGap = (gap: number) =>
    dispatch(updateWidgetLayoutConfig(widget.id, 'rowGap', gap));

  const handleUpdateColumnAlignment = (alignment: GridAlignment) =>
    dispatch(updateWidgetLayoutConfig(widget.id, 'columnAlignment', alignment));

  const handleUpdateRowAlignment = (alignment: GridAlignment) =>
    dispatch(updateWidgetLayoutConfig(widget.id, 'rowAlignment', alignment));

  return (
    <Styles.Container>
      <GridPreview columns={widget.layout.columns} rows={widget.layout.rows} />
      <GridTemplateControls
        name="column"
        config={widget.layout.columns}
        updateConfig={handleUpdateColumns}
      />
      <GridTemplateControls
        name="row"
        config={widget.layout.rows}
        updateConfig={handleUpdateRows}
      />
      <GridGap name="column" gap={widget.layout.columnGap} updateGap={handleUpdateColumnGap} />
      <GridGap name="row" gap={widget.layout.rowGap} updateGap={handleUpdateRowGap} />
      <GridAlignmentConfig
        name="column"
        alignment={widget.layout.columnAlignment}
        updateAlignment={handleUpdateColumnAlignment}
      />
      <GridAlignmentConfig
        name="row"
        alignment={widget.layout.rowAlignment}
        updateAlignment={handleUpdateRowAlignment}
      />
      <div style={{ height: 100 }} />
    </Styles.Container>
  );
};
