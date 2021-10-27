import * as React from 'react';
import { useDispatch } from 'react-redux';
import { StyledComponent, DefaultTheme } from 'styled-components';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Element } from '@ui-studio/types';
import { updateElementName } from 'actions/name';
import { ElementIcon } from 'components/ElementIcon';

interface Props {
  element: Element;
}

export const EditName = ({ element }: Props) => {
  const dispatch = useDispatch();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateElementName(event.target.value));
  };

  return (
    <TextField
      size="medium"
      variant="standard"
      value={element.name}
      onChange={handleOnChange}
      onFocus={(event) => {
        event.target.select();
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <ElementIcon element={element} sx={{ color: 'action.active', ml: 1 }} />
          </InputAdornment>
        ),
      }}
    />
  );
};
