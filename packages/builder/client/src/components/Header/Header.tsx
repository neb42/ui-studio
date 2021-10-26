import * as React from 'react';
import Typography from '@mui/material/Typography';
import { ScreenSizeSelection } from 'components/ScreenSizeSelection';

import * as Styles from './Header.styles';

export const Header = () => (
  <Styles.Container>
    <Typography variant="h5" sx={{ color: 'text.secondary' }}>
      UI Studio
    </Typography>
    <ScreenSizeSelection />
    <div />
  </Styles.Container>
);
