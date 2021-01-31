import * as React from 'react';
import Input from '@faculty/adler-web-components/atoms/Input';

import * as Styles from './GridGap.styles';

interface GridGapProps {
  name: 'column' | 'row';
  gap: number;
  updateGap: (gap: number) => any;
}

export const GridGap = ({ name, gap, updateGap }: GridGapProps): JSX.Element => {
  return (
    <Styles.Container>
      <Styles.Name>{name} gap</Styles.Name>
      <Input type="number" value={gap} onChange={updateGap} />
    </Styles.Container>
  );
};
