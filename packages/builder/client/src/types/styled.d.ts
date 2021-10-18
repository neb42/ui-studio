import 'styled-components';
import { Theme } from '@mui/material/styles';
import { AdlerTheme } from '@faculty/adler-tokens';

declare module '@mui/material/styles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme {
    colors: AdlerTheme['colors'];
    fonts: AdlerTheme['fonts'];
    header: AdlerTheme['header'];
    boxshadow: AdlerTheme['boxshadow'];
  }
  // allow configuration using `createTheme`
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface ThemeOptions {
    colors: AdlerTheme['colors'];
    fonts: AdlerTheme['fonts'];
    header: AdlerTheme['header'];
    boxshadow: AdlerTheme['boxshadow'];
  }
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {
    colors: AdlerTheme['colors'];
    fonts: AdlerTheme['fonts'];
    header: AdlerTheme['header'];
    boxshadow: AdlerTheme['boxshadow'];
  }
}
