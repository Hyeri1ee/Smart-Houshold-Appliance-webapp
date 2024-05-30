import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/login';
import RegisterPage from './components/auth/register';
import AskTimeslotPage from './components/userinfo/timeslotAsking';
import AddTimeslot from './components/userinfo/addtimeslot';
import {Route, Navigate, Routes} from 'react-router-dom';
import Login from './components/auth/login';
import Register from './components/auth/register';

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    await navigator.serviceWorker.register("progressive-web-app/sw.js");
  });
}

function App() {
  return (
    <>
      <Routes>
        <Route index element={ <Navigate to="/register" />} />
        <Route path="login" element={ <Login />} />
        <Route path="register" element={ <Register />} />
        <Route path="/userinfo/timeslotAsking" element={<AskTimeslotPage/>}/>
        <Route path="/userinfo/addTimeslot" element={<AddTimeslot/>}/>
      </Routes>
    </>
  );
}

export default App;