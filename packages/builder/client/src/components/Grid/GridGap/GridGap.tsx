import * as React from 'react';
import TextField from '@mui/material/TextField';

interface GridGapProps {
  name: 'column' | 'row';
  gap: number;
  updateGap: (gap: number) => any;
}

export const GridGap = ({ name, gap, updateGap }: GridGapProps): JSX.Element => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    updateGap(Number(event.target.value));

  return (
    <TextField
      label={`${name.charAt(0).toUpperCase() + name.slice(1)} gap`}
      value={gap}
      onChange={handleOnChange}
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
    />
  );
};
