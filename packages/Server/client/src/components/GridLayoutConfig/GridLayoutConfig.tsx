import * as React from 'react';
import { useDispatch } from 'react-redux';
import { GridPreview } from 'components/GridPreview';
import { GridTemplateControls } from 'components/GridTemplateControls';
import { updateElement } from 'actions/element';
import { Page, Layout, Widget } from 'types/element';

import * as Styles from './GridLayoutConfig.styles';

type Unit = 'fr' | '%' | 'px' | 'em' | 'mincontent' | 'maxcontent' | 'minmax';
interface IGridCell {
  value: number;
  unit: Unit;
}

const defaultCell: IGridCell = { value: 1, unit: 'fr' };

interface IGridLayoutConfig {
  element: Page | Layout | Widget;
}

export const GridLayoutConfig = ({ element }: IGridLayoutConfig): JSX.Element => {
  const dispatch = useDispatch();
  const [columns, setColumns] = React.useState<IGridCell[]>([defaultCell]);
  const [rows, setRows] = React.useState<IGridCell[]>([defaultCell]);

  React.useEffect(() => {
    dispatch(updateElement(element.name, 'layout', 'columns', columns));
  }, [JSON.stringify(columns)]);

  React.useEffect(() => {
    dispatch(updateElement(element.name, 'layout', 'rows', rows));
  }, [JSON.stringify(rows)]);

  return (
    <Styles.Container>
      <GridPreview columns={columns} rows={rows} />
      <GridTemplateControls name="column" config={columns} updateConfig={setColumns} />
      <GridTemplateControls name="row" config={rows} updateConfig={setRows} />
    </Styles.Container>
  );
};
