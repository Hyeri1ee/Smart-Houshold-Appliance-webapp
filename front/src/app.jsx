import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/login';
import RegisterPage from './components/auth/register';
import AskTimeslotPage from './components/userinfo/timeslotAsking';
import AddTimeslot from './components/userinfo/addtimeslot';

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("progressive-web-app/sw.js");
  });
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/userinfo/timeslotAsking" element={<AskTimeslotPage/>}/>
        <Route path="/userinfo/addTimeslot" element={<AddTimeslot/>}/>
        </Routes>
    </Router>
  );
}

export default App;