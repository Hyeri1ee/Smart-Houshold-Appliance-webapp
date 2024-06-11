import React from 'react';
import {Route, Navigate, Routes} from 'react-router-dom';

import WashingMachine from "./pages/WashingMachine";

import "./styles/reset.css"
import "./styles/global.css"
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:1337';
axios.defaults.withCredentials = true;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    await navigator.serviceWorker.register("/Service-worker.js");
  });
}

function App() {
  return (
    <>
      <Routes>
        <Route index element={ <Navigate to="/wash" />} />
        <Route path="wash" element={ <WashingMachine />} />

      </Routes>
    </>
  );
}

export default App;