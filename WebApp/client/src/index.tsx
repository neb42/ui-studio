import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';

import store from './store';
import App from './App';

const GlobalStyles = createGlobalStyle`
  body {
    height: 100vh;
    width: 100vw;
    margin: 0;
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
    <Provider store={store}>
      <GlobalStyles />
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
