import * as React from 'react';
import { GridAlignment } from '@ui-studio/types';

import { AlignmentButton } from 'components/AlignmentButton';

import * as Styles from './GridAlignmentConfig.styles';

interface GridAlignmentConfigProps {
  self?: boolean;
  name: 'row' | 'column';
  alignment: GridAlignment;
  updateAlignment: (a: GridAlignment) => any;
}

export const GridAlignmentConfig = ({
  self,
  name,
  alignment,
  updateAlignment,
}: GridAlignmentConfigProps): JSX.Element => {
  const handleOnChange = (value: string) => updateAlignment(value as GridAlignment);

  return (
    <Styles.Container>
      <Styles.Name>{name} alignment</Styles.Name>
      <AlignmentButton
        layoutType="grid"
        direction={self ? name : 'row'}
        alignmentType={self ? 'self' : name === 'row' ? 'align' : 'justify'}
        value={alignment}
        onChange={handleOnChange}
      />
    </Styles.Container>
  );
};
