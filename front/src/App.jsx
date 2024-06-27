import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Schedule from "./pages/SchedulePage";
import UserProfilePage from "./pages/UserprofilePage";
import HomeConnectLogin from "./pages/HomeConnectLogin";
import LoginFailed from "./pages/LoginFailed";
import DeviceDetails from "./pages/DeviceDetails";
import BottomNavBar from "./components/generic/BottomNavigationBar";
import HomeConnectSimulator from './pages/HomeConnectSimulatorLogin';
import "./styles/reset.css";
import "./styles/global.css";
import axios from 'axios';
import TimeslotAsking from "./pages/AskTimeslotsPage";
import { GlobalStateProvider } from './components/generic/GlobalStateContext';
import SettingPage from './pages/SettingPage';
import PushNotificationComponent from "./components/PushNotificationContainer";
import SettingPage from './pages/SettingPage';


axios.defaults.baseURL = 'http://localhost:1337';
axios.defaults.withCredentials = true;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    await navigator.serviceWorker.register("/ServiceWorker.js");
  });
}

function App() {
  const location = useLocation();

  // exclude navbar from login and register
  const shouldRenderNavBar = !["/login", "/register", "/user/timeslots","/user/profile"].includes(location.pathname);

  return (
    <GlobalStateProvider>
      <div className="app-container">
        <Routes>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="login" element={<Login />} />
          <Route path="login/homeconnect" element={<HomeConnectLogin />} />
          <Route path="login/homeconnect/simulator" element={<HomeConnectSimulator />} />
          <Route path="login/failed" element={<LoginFailed />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user/schedule" element={<Schedule />} />
          <Route path="device/details" element={<DeviceDetails />} />
          <Route path="user/profile" element={<UserProfilePage />} />
          <Route path="user/timeslots" element={<TimeslotAsking />} />
          <Route path="user/settings" element={<SettingPage />} />
          <Route path="push" element={<PushNotificationComponent/>}/>
        </Routes>
        {shouldRenderNavBar && <BottomNavBar />}
      </div>
    </GlobalStateProvider>
  );
}

export default App;