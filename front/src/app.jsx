import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/login';
import RegisterPage from './components/auth/register';
import SchedulePage from "./components/user/schedule";

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
        <Route path="/schedule" element={<SchedulePage />} />

      </Routes>
    </Router>
  );
}

export default App;