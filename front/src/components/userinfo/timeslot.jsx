import React, { useState } from 'react';
//import '../styles/global.css';
import '../styles/userinfo/timeslot.css';
import CAL from '../images/cal.png';
import CLK from '../images/clk.png';

function Timeslot() {
    const numberTimeslot = useState('');
    const dayOftheWeek = useState('');
    const time = useState('');
    return (
      <div class="timeslot">
        <div class="title">
          <p>Timeslot 1{numberTimeslot}</p>
        </div>
        <div class="content">
          <img id="calendarImg" src={CAL} alt="calendar" />
  
          <span id="day">Monday {dayOftheWeek}</span>
          <img id="clockImg" src={CLK} alt="clock" />
          <span id="time">16:30~19:30 {dayOftheWeek}</span>
        </div>
      </div>
    );
  }
  
  export default Timeslot;