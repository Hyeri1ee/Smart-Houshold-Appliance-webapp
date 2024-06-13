import React from 'react';
import {Link, Navigate, Route} from 'react-router-dom';
import "../../styles/components/navBar.css"
import homeIcon from '../../../public/home.png'
import devicesIcon from '../../../public/devices.png'
import scheduleIcon from '../../../public/schedule.png'
import settingsIcon from '../../../public/settings.png'



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
