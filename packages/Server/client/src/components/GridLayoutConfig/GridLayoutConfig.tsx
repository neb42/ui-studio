import * as React from 'react';
import { GridPreview } from 'components/GridPreview';
import { GridTemplateControls } from 'components/GridTemplateControls';

import * as Styles from './GridLayoutConfig.styles';

type Unit = 'fr' | '%' | 'px' | 'em' | 'mincontent' | 'maxcontent' | 'minmax';
interface IGridCell {
  value: number;
  unit: Unit;
}

const defaultCell: IGridCell = { value: 1, unit: 'fr' };

export const GridLayoutConfig = (): JSX.Element => {
  const [columns, setColumns] = React.useState<IGridCell[]>([defaultCell]);
  const [rows, setRows] = React.useState<IGridCell[]>([defaultCell]);

  return (
    <Styles.Container>
      <GridPreview columns={columns} rows={rows} />
      <GridTemplateControls name="column" config={columns} updateConfig={setColumns} />
      <GridTemplateControls name="row" config={rows} updateConfig={setRows} />
    </Styles.Container>
  );
};
