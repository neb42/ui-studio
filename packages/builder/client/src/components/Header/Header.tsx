import * as React from 'react';
import Typography from '@mui/material/Typography';
import { ScreenSizeSelection } from 'components/ScreenSizeSelection';

import * as Styles from './Header.styles';

export const Header = () => (
  <Styles.Container>
    <Typography variant="h5" sx={{ color: '#fff', textShadow: '1px 1px #000' }}>
      UI Studio
    </Typography>
    <ScreenSizeSelection />
    <div />
  </Styles.Container>
);
