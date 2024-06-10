import {Navigate, Route, Routes} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PanelsInfoPage from './pages/PanelsinfoPage';
import Schedule from "./pages/Schedule";
import "./styles/reset.css"
import "./styles/global.css"
import axios from 'axios';
import UserProfilePage from "./pages/UserProfilePage";
import {checkUserInfo} from "./helpers/CheckUserInfo";

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
        <Route index element={ <Navigate to="/dashboard" />} />
        <Route path="login" element={ <Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="user/schedule" element={<Schedule />} />
        <Route path="user/profile/type" element={<UserProfilePage />} />
        <Route path="panels/info" element={<PanelsInfoPage />} />
      </Routes>
    </>
  );
}

export default App;