import * as React from 'react';
import { Element } from '@ui-studio/types';
import { SegmentedControl } from '@faculty/adler-web-components/atoms/SegmentedControl';

import * as Styles from './Overflow.styles';

type Props = {
  overflow: Element['style']['properties']['overflow'];
  onOverflowChange: (overflow: Element['style']['properties']['overflow']) => any;
};

export const OverflowComponent = ({ overflow, onOverflowChange }: Props) => {
  const handleOnChange = (value: string) => {
    onOverflowChange(value as Element['style']['properties']['overflow']);
  };

  return (
    <Styles.Container>
      <Styles.Header>Overflow</Styles.Header>
      <SegmentedControl name="overflowPicker" value={overflow} controlled onChange={handleOnChange}>
        {['visible', 'hidden', 'auto', 'scroll'].map((o) => (
          <SegmentedControl.Item key={o} label={o} name={o} value={o} />
        ))}
      </SegmentedControl>
    </Styles.Container>
  );
};
