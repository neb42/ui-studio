import * as React from 'react';
import { Element } from '@ui-studio/types';
import Select from '@faculty/adler-web-components/atoms/Select';

import * as Styles from './Overflow.styles';

type Props = {
  overflow: Element['style']['properties']['overflow'];
  onOverflowChange: (overflow: Element['style']['properties']['overflow']) => any;
};

const options = ['visible', 'hidden', 'auto', 'scroll'].map((o) => ({ label: o, value: o }));

export const OverflowComponent = ({ overflow, onOverflowChange }: Props) => {
  const handleOnChange = ({ value }: any) => {
    onOverflowChange(value);
  };

  return (
    <Styles.Container>
      <Styles.Header>Overflow</Styles.Header>
      <Select
        options={options}
        value={options.find((o) => o.value === overflow)}
        onChange={handleOnChange}
      />
    </Styles.Container>
  );
};
