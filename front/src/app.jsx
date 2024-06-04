import {Route, Navigate, Routes} from 'react-router-dom';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Dashboard from './components/Dashboard';
import PanelsInfoPage from './PanelsinfoPage';
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
        <Route index element={ <Navigate to="/dashboard" />} />
        <Route path="login" element={ <Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="user/schedule" element={<Schedule />} />
        <Route path="panels/info" element={<PanelsInfoPage />} />
      </Routes>
    </>
  );
}

export default App;