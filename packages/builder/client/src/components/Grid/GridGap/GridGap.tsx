import * as React from 'react';
import TextField from '@mui/material/TextField';

import * as Styles from './GridGap.styles';

interface GridGapProps {
  name: 'column' | 'row';
  gap: number;
  updateGap: (gap: number) => any;
}

export const GridGap = ({ name, gap, updateGap }: GridGapProps): JSX.Element => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    updateGap(Number(event.target.value));

  return (
    <Styles.Container>
      <Styles.Name>{name} gap</Styles.Name>
      <TextField
        value={gap}
        onChange={handleOnChange}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      />
    </Styles.Container>
  );
};
