import * as React from 'react';
import { useDispatch } from 'react-redux';
import { TextField } from '@material-ui/core';
import { Element } from '@ui-builder/types';
import { updateElementClassNames } from 'actions/element';

import * as Styles from './ClassNamesInput.styles';

interface ClassNamesInputProps {
  element: Element;
}

export const ClassNamesInput = ({ element }: ClassNamesInputProps): JSX.Element => {
  const dispatch = useDispatch();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(updateElementClassNames(element.id, event.target.value));

  return (
    <Styles.Container>
      <Styles.Header>Class names</Styles.Header>
      <TextField
        onChange={handleOnChange}
        value={element.style.classNames}
        style={{ width: '100%' }}
        // TODO add type validation function
      />
    </Styles.Container>
  );
};
