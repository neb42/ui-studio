import * as React from 'react';
import { GridLayout, Layout, Widget } from '@ui-builder/types';
import { GridPreview } from 'components/Grid/GridPreview';

import * as Styles from './GridParentStyle.styles';

interface IGridParentStyle {
  element: Layout | Widget;
  parent: GridLayout;
}

export const GridParentStyle = ({ element, parent }: IGridParentStyle): JSX.Element => {
  return (
    <Styles.Container>
      <GridPreview columns={parent?.props?.columns ?? []} rows={parent?.props?.rows ?? []} />
    </Styles.Container>
  );
};
