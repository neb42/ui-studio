import * as React from 'react';
import { useDispatch } from 'react-redux';
import Input from '@faculty/adler-web-components/atoms/Input';
import { Element } from '@ui-builder/types';
import { updateElementClassNames } from 'actions/element';

import * as Styles from './ClassNamesInput.styles';

interface ClassNamesInputProps {
  element: Element;
}

export const ClassNamesInput = ({ element }: ClassNamesInputProps): JSX.Element => {
  const dispatch = useDispatch();

  const handleOnChange = (value: string) => dispatch(updateElementClassNames(element.id, value));

  return (
    <Styles.Container>
      <Styles.Header>Class names</Styles.Header>
      <Input onChange={handleOnChange} value={element.style.classNames} />
    </Styles.Container>
  );
};
