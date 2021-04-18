import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import App from './App';
import { Router } from './Router';
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
    background-color: #fff;
  }

  * {
    box-sizing: border-box;
    outline: none !important;
    outline-width: 0 !important;
    outline-style: none !important;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <App>
      <Provider store={store}>
        <BrowserRouter>
          <GlobalStyles />
          <Router />
          <DevCommunicator />
        </BrowserRouter>
      </Provider>
    </App>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
