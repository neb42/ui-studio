import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Element } from '@ui-studio/types';
import { Outline } from 'components/Outline';

import * as Styles from './Overflow.styles';

type Props = {
  overflow: Element['style']['properties']['overflow'];
  onOverflowChange: (overflow: Element['style']['properties']['overflow']) => any;
};

export const OverflowComponent = ({ overflow, onOverflowChange }: Props) => {
  const handleOnChange = (_: React.MouseEvent<HTMLElement>, value: string) => {
    if (value !== null) onOverflowChange(value as Element['style']['properties']['overflow']);
  };

  return (
    <Outline label="Overflow">
      <Styles.Container>
        <ToggleButtonGroup
          color="primary"
          value={overflow}
          exclusive
          onChange={handleOnChange}
          size="small"
          fullWidth
        >
          {['visible', 'hidden', 'auto', 'scroll'].map((o) => (
            <ToggleButton key={o} value={o}>
              {o}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Styles.Container>
    </Outline>
  );
};
