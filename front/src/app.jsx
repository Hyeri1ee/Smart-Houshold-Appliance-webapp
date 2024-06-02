import {Route, Navigate, Routes} from 'react-router-dom';
import Login from './components/auth/login';
import Register from './components/auth/register';
import PanelsInfoPage from './PanelsinfoPage';

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
        <Route path="register" element={<Register />} />
        <Route path="panelsinfo" element={<PanelsInfoPage />} />
      </Routes>
    </>
  );
}

export default App;