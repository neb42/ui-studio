import * as React from 'react';
import TextField from '@mui/material/TextField';

type Props = {
  label?: string;
  children: any;
};

const InputComponent = ({ inputRef: _, ...other }: any) => <div {...other} />;

export const OutlineComponent = ({ children, label }: Props) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      multiline
      InputLabelProps={{ shrink: true }}
      InputProps={{
        inputComponent: InputComponent,
      }}
      inputProps={{ children }}
    />
  );
};
