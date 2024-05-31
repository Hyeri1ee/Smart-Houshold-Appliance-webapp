import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Schedule from "./components/user/schedule";
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:1337';
axios.defaults.withCredentials = true;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    await navigator.serviceWorker.register("progressive-web-app/sw.js");
  });
}

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="/register"/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="register" element={<Register/>}/>
        <Route path="user/schedule" element={<Schedule/>}/>
        {/*<Route path="/userinfo/timeslotAsking" element={<AskTimeslotPage/>}/>*/}
        {/*<Route path="/userinfo/addTimeslot" element={<AddTimeslot/>}/>*/}
      </Routes>
    </>
  );
}

export default App;