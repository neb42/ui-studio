import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { defaultTokens } from '@faculty/adler-tokens';

import store from './store';
import App from './App';

const GlobalStyles = createGlobalStyle`
  body {
    height: 100vh;
    width: 100vw;
    margin: 0;
    font-family: 'Inter UI', sans-serif;
  }

  #root {
    height: 100vh;
  }

  * {
    box-sizing: border-box;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={defaultTokens}>
      <Provider store={store}>
        <GlobalStyles />
        <Router>
          <App />
        </Router>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
