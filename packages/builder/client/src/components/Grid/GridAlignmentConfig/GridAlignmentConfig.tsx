import * as React from 'react';
import { GridAlignment } from '@ui-studio/types';
import { AlignmentButton } from 'components/AlignmentButton';

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
    <AlignmentButton
      label={`${name.charAt(0).toUpperCase() + name.slice(1)} alignment`}
      layoutType="grid"
      direction={self ? name : 'row'}
      alignmentType={self ? 'self' : name === 'row' ? 'align' : 'justify'}
      value={alignment}
      onChange={handleOnChange}
    />
  );
};
