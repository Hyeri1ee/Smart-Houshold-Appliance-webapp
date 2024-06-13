import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navBar/navBar.css';

import homeIcon from "/home.png";
import devicesIcon from "/devices.png";
import scheduleIcon from "/schedule.png";
import settingsIcon from "/settings.png";

function BottomNavBar() {
    return (
        <div className="bottom-nav-bar">
            <Link to="/home">
                <img src={homeIcon} alt="Home" />
            </Link>
            <Link to="/devices">
                <img src={devicesIcon} alt="Devices" />
            </Link>
            <Link to="/dashboard">
                <img src={scheduleIcon} alt="Dashboard" />
            </Link>
            <Link to="/user/settings">
                <img src={settingsIcon} alt="Settings" />
            </Link>
        </div>
    );
}
export default BottomNavBar;
