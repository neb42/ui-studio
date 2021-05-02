import * as React from 'react';

import { ScreenSizeSelection } from 'components/ScreenSizeSelection';

import logo from './logo.svg';
import * as Styles from './Header.styles';

export const Header = () => (
  <Styles.Container>
    <Styles.Title>
      <img src={logo} alt="logo" height={45} width={45} />
      UI Studio
    </Styles.Title>
    <ScreenSizeSelection />
    <div />
  </Styles.Container>
);
