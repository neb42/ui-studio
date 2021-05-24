import * as React from 'react';
import { useDispatch } from 'react-redux';
import Input from '@faculty/adler-web-components/atoms/Input';
import { Element } from '@ui-studio/types';
import { updateElementClassNames } from 'actions/styles';

import * as Styles from './ClassNamesInput.styles';

interface Props {
  element: Element;
}

export const ClassNamesInput = ({ element }: Props): JSX.Element => {
  const dispatch = useDispatch();

  const handleOnChange = (value: string) => dispatch(updateElementClassNames(value));

  return (
    <Styles.Container>
      <Styles.Header>Class names</Styles.Header>
      <Input onChange={handleOnChange} value={element.style.classNames} />
    </Styles.Container>
  );
};
