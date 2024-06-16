import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PanelsInfoPage from './pages/PanelsinfoPage';
import Schedule from "./pages/Schedule";
import UserprofilePage from "./pages/UserprofilePage";
import HomeConnectLogin from "./pages/HomeConnectLogin";
import LoginFailed from "./pages/LoginFailed";
import DeviceDetails from "./pages/DeviceDetails";
import BottomNavBar from "./components/generic/bottom-navigation-bar";
import "./styles/reset.css";
import "./styles/global.css";
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:1337';
axios.defaults.withCredentials = true;

if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        await navigator.serviceWorker.register("/Service-worker.js");
    });
}

function App() {
    const location = useLocation();

    // exclude navbar from login and register
    const shouldRenderNavBar = !["/login", "/register"].includes(location.pathname);

    return (
        <div className="app-container">
            <Routes>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="login" element={<Login />} />
                <Route path="login/homeconnect" element={<HomeConnectLogin />} />
                <Route path="login/failed" element={<LoginFailed />} />
                <Route path="register" element={<Register />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="user/schedule" element={<Schedule />} />
                <Route path="panels/info" element={<PanelsInfoPage />} />
                <Route path="device/details" element={<DeviceDetails />} />
                <Route path="user/profile" element={<UserprofilePage />} />
            </Routes>
            {shouldRenderNavBar && <BottomNavBar />}
        </div>
    );
}

export default App;
