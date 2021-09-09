import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'urql';
import App from './App';
import './index.css';
import client from './urql/client';

ReactDOM.render(
  <Provider value={client}>
    <App />
  </Provider>,
  document.getElementById('root')
);
