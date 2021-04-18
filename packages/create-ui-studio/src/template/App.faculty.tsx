import * as React from 'react';
import { defaultTokens, ThemeProvider } from '@faculty/adler-tokens';

const App = ({ children }: any) => <ThemeProvider theme={defaultTokens}>{children}</ThemeProvider>;

export default App;
