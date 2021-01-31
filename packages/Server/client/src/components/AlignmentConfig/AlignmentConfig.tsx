import * as React from 'react';
import Select from '@faculty/adler-web-components/atoms/Select';
import { Alignment } from '@ui-builder/types';

import * as Styles from './AlignmentConfig.styles';

const alignmentOptions = [
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
  { value: 'center', label: 'Center' },
  { value: 'stretch', label: 'Stretch' },
];

interface AlignmentConfigProps {
  name: string;
  alignment: Alignment;
  updateAlignment: (a: Alignment) => any;
}

export const AlignmentConfig = ({
  name,
  alignment,
  updateAlignment,
}: AlignmentConfigProps): JSX.Element => {
  const handleOnChange = ({ value }: any) => updateAlignment(value as Alignment);

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
