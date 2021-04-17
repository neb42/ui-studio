import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { defaultTokens, ThemeProvider } from '@faculty/adler-tokens';

import 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/worker-json';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/worker-css';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/ext-language_tools';

import store from './store';
import App from './App';

const GlobalStyles = createGlobalStyle`
  body {
    height: 100vh;
    width: 100vw;
    margin: 0;
    font-family: 'Inter', sans-serif;
  }

  #root {
    height: 100vh;
  }

  * {
    box-sizing: border-box;
  }

  &:focus {
    outline: none;
  }

  & .MuiSpeedDial-root {
    position: absolute;
    top: 6px;
    height: 24px;
    right: 0;

    & .MuiFab-root {
      width: 24px;
      height: 24px;
      min-height: 24px;
      box-shadow: rgb(232 232 232) 0px 3px 2px 0px;

      & .MuiSvgIcon-root {
        width: 16px;
        height: 16px;
      }
    }

    & .MuiFab-primary {
      background-color: #1c1c1c;

      &:hover {
        background-color: #1c1c1c;
      }
    }

    & .MuiSpeedDial-actions{
      padding-right: 36px !important;
    }

    & .MuiSpeedDialAction-fab {
      margin: 4px;
    }
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
