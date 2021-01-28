import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { defaultTokens, ThemeProvider } from '@faculty/adler-tokens';

import { App } from './App';
import { store } from './store';
import { DevCommunicator } from './DevCommunicator';
import reportWebVitals from './reportWebVitals';

import './subscriber';

const GlobalStyles = createGlobalStyle`
  body {
    height: 100vh;
    width: 100vw;
    margin: 0;
  }

  #root {
    height: 100vh;
    width: 100vw;
  }

  * {
    box-sizing: border-box;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={defaultTokens}>
      <Provider store={store}>
        <Router>
          <GlobalStyles />
          <App />
          <DevCommunicator />
        </Router>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
