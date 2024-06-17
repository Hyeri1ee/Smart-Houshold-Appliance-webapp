import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
);

//"FrogDarkest": "132a13",
//  "FrogDark": "31572c",
//  "Frog": "4f772d",
//  "FrogLighter": "90a955",
//  "FrogLightest": "ecf39e",
//  "TestColor": "fa11f2",