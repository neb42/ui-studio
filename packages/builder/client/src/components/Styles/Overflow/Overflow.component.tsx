import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Element } from '@ui-studio/types';

import * as Styles from './Overflow.styles';

type Props = {
  overflow: Element['style']['properties']['overflow'];
  onOverflowChange: (overflow: Element['style']['properties']['overflow']) => any;
};

export const OverflowComponent = ({ overflow, onOverflowChange }: Props) => {
  const handleOnChange = (_: React.MouseEvent<HTMLElement>, value: string) => {
    onOverflowChange(value as Element['style']['properties']['overflow']);
  };

  return (
    <Styles.Container>
      <Styles.Header>Overflow</Styles.Header>
      <ToggleButtonGroup color="primary" value={overflow} exclusive onChange={handleOnChange}>
        {['visible', 'hidden', 'auto', 'scroll'].map((o) => (
          <ToggleButton key={o} value={o}>
            {o}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Styles.Container>
  );
};
