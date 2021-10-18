import * as React from 'react';
import { useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import { Element } from '@ui-studio/types';
import { updateElementClassNames } from 'actions/styles';

import * as Styles from './ClassNamesInput.styles';

interface Props {
  element: Element;
}

export const ClassNamesInput = ({ element }: Props): JSX.Element => {
  const dispatch = useDispatch();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(updateElementClassNames(event.target.value));

  return (
    <Styles.Container>
      <Styles.Header>Class names</Styles.Header>
      <TextField onChange={handleOnChange} value={element.style.classNames} />
    </Styles.Container>
  );
};
