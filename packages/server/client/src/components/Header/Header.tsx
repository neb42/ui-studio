import * as React from 'react';

import logo from './logo.svg';
import * as Styles from './Header.styles';

export const Header = () => (
  <Styles.Container>
    <img src={logo} alt="logo" height={45} width={45} />
    Canvas
  </Styles.Container>
);
