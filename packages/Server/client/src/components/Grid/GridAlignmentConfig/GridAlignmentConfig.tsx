import * as React from 'react';
import Select from '@faculty/adler-web-components/atoms/Select';
import { GridAlignment } from '@ui-builder/types';

import * as Styles from './GridAlignmentConfig.styles';

const alignmentOptions = [
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
  { value: 'center', label: 'Center' },
  { value: 'stretch', label: 'Stretch' },
];

interface GridAlignmentConfigProps {
  name: string;
  alignment: GridAlignment;
  updateAlignment: (a: GridAlignment) => any;
}

export const GridAlignmentConfig = ({
  name,
  alignment,
  updateAlignment,
}: GridAlignmentConfigProps): JSX.Element => {
  const handleOnChange = ({ value }: any) => updateAlignment(value as GridAlignment);

  return (
    <Styles.Container>
      <Styles.Name>{name} alignment</Styles.Name>
      <Select
        value={alignmentOptions.find((a) => a.value === alignment)}
        onChange={handleOnChange}
        options={alignmentOptions}
      />
    </Styles.Container>
  );
};
