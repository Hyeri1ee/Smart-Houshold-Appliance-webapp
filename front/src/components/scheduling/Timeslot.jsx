import React, {useState} from 'react';

import '../../styles/userinfo/timeslot.css';
import CAL from '../../assets/cal.png';
import CLK from '../../assets/clk.png';

function Timeslot() {
    const numberTimeslot = useState('');
    const dayOftheWeek = useState('');
    return (
      <div className="timeslot">
        <div className="title">
          <p>Timeslot 1{numberTimeslot}</p>
        </div>
        <div className="content">
          <img id="calendarImg" src={CAL} alt="calendar" />
  
          <span id="day">Monday {dayOftheWeek}</span>
          <img id="clockImg" src={CLK} alt="clock" />
          <span id="time">16:30~19:30 {dayOftheWeek}</span>
        </div>
      </div>
    );
  }
  
  export default Timeslot;