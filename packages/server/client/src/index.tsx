import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { defaultTokens, ThemeProvider } from '@faculty/adler-tokens';

// import 'react-ace';
// import 'ace-builds/src-noconflict/mode-json';
// import 'ace-builds/src-noconflict/worker-json';
// import 'ace-builds/src-noconflict/mode-css';
// import 'ace-builds/src-noconflict/worker-css';
// import 'ace-builds/src-noconflict/theme-chrome';
// import 'ace-builds/src-noconflict/ext-language_tools';

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

  &:focus {
    outline: none;
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
