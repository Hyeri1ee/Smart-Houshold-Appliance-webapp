import { Link } from 'react-router-dom';
import '../styles/navBar/navBar.css';

import homeIcon from "/home.png";
import devicesIcon from "/devices.png";
import scheduleIcon from "/schedule.png";
import settingsIcon from "/settings.png";

function BottomNavBar() {
    return (
        <div className="bottom-nav-bar">
            <Link to="/dashboard">
                <img src={homeIcon} alt="Dashboard" />
            </Link>
            <Link to="/device/details">
                <img src={devicesIcon} alt="Devices" />
            </Link>
            <Link to="user/schedule">
                <img src={scheduleIcon} alt="Schedule" />
            </Link>
            <Link to="/user/settings">
                <img src={settingsIcon} alt="Settings" />
            </Link>
        </div>
    );
}
export default BottomNavBar;
