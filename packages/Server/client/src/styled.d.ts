import 'styled-components';
import { AdlerTheme } from '@faculty/adler-tokens';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends AdlerTheme {}
}
