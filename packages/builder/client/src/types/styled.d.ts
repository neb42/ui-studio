import 'styled-components';
import { Theme } from '@mui/material/styles';

import { themeSettings } from '../theme';

type ThemeSettings = typeof themeSettings;

declare module '@mui/material/styles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme extends ThemeSettings {}
  // allow configuration using `createTheme`
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ThemeOptions extends ThemeSettings {}
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme, ThemeSettings {}
}
