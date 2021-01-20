import 'styled-components';
import { AdlerTheme } from '@faculty/adler-tokens';

declare module 'styled-components' {
  export interface DefaultTheme extends AdlerTheme {}
}
