import React, { useState, useEffect } from 'react';
import '../styles/pages/Washing.css';
import washingMachineImage from "../assets/device/machine.png";
import TimePicker from '../components/generic/TimePicker';

const WashingMachine = () => {
  const [startOption, setStartOption] = useState('now');
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState('Cotton');
  const [currentDegree, setCurrentDegree] = useState('40');
  const [currentSpin, setCurrentSpin] = useState('1000');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [washerInterval, setWasherInterval] = useState(30000);
  const [decreaseStartTimeHeight, setDecreaseStartTimeHeight] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const washingMachineId = 'SIEMENS-HCS03WCH1-7BC6383CF794';

  const handleStartStop = () => {
    if (isRunning) {
      stopWashingMachine();
    } else if (startOption === 'now') {
      startWashingMachine();
    } else if (startOption === 'schedule' && scheduledTime) {
      const currentTime = Date.now();
      const countdownDuration = scheduledTime.getTime() - currentTime;
      setCountdown(countdownDuration);
      window.localStorage.setItem('scheduledTime', scheduledTime.toISOString());
      window.localStorage.setItem('countdown', countdownDuration);
    }
  };

  const reduceStartTimeSectionHeight = () => {
    document.querySelector('.start-time-section').classList.add('adjusted');
  }

  const increaseStartTimeSectionHeight = () => {
    document.querySelector('.start-time-section').classList.remove('adjusted');
  }

  const fetchWasherStatus = async () => {
    try {
      const accessToken = window.sessionStorage.getItem('homeconnect_simulator_auth_token');
      const response = await fetch(`https://simulator.home-connect.com/api/homeappliances/${washingMachineId}/status`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.bsh.sdk.v1+json',
        },
      });

      const data = await response.json();
      const operationState = data.data.status.find(status => status.key === 'BSH.Common.Status.OperationState');
      
      if (operationState.value !== 'BSH.Common.EnumType.OperationState.Run') {
        setIsRunning(false);
        setEndTime(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const stopWashingMachine = async () => {
    try {
      const accessToken = window.sessionStorage.getItem('homeconnect_simulator_auth_token');
      const response = await fetch(`https://simulator.home-connect.com/api/homeappliances/${washingMachineId}/programs/active`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.bsh.sdk.v1+json',
        },
      });

      if (response.status === 204 || response.status === 200) {
        setIsRunning(false);
        setEndTime(null);
      } else {
        console.log("Error stopping the washing machine");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const statusInterval = setInterval(() => {
      fetchWasherStatus();
    }, washerInterval);

    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    if (decreaseStartTimeHeight) {
      reduceStartTimeSectionHeight();
    } else {
      increaseStartTimeSectionHeight();
    }
  }, [decreaseStartTimeHeight]);

  const startWashingMachine = async () => {
    try {
      const accessToken = window.sessionStorage.getItem('homeconnect_simulator_auth_token');
      const programKey = {
        'Cotton': 'LaundryCare.Washer.Program.Cotton',
        'EasyCare': 'LaundryCare.Washer.Program.EasyCare',
        'Mix': 'LaundryCare.Washer.Program.Mix',
        'DelicatesSilk': 'LaundryCare.Washer.Program.DelicatesSilk',
        'Wool': 'LaundryCare.Washer.Program.Wool'
      }[currentMode];

      const temperatureKey = {
        '20': 'LaundryCare.Washer.EnumType.Temperature.GC20',
        '30': 'LaundryCare.Washer.EnumType.Temperature.GC30',
        '40': 'LaundryCare.Washer.EnumType.Temperature.GC40',
        '50': 'LaundryCare.Washer.EnumType.Temperature.GC50',
        '60': 'LaundryCare.Washer.EnumType.Temperature.GC60',
        '70': 'LaundryCare.Washer.EnumType.Temperature.GC70',
        '80': 'LaundryCare.Washer.EnumType.Temperature.GC80',
        '90': 'LaundryCare.Washer.EnumType.Temperature.GC90'
      }[currentDegree];

      const spinKey = {
        '400': 'LaundryCare.Washer.EnumType.SpinSpeed.RPM400',
        '600': 'LaundryCare.Washer.EnumType.SpinSpeed.RPM600',
        '800': 'LaundryCare.Washer.EnumType.SpinSpeed.RPM800',
        '1000': 'LaundryCare.Washer.EnumType.SpinSpeed.RPM1000',
        '1200': 'LaundryCare.Washer.EnumType.SpinSpeed.RPM1200',
        '1400': 'LaundryCare.Washer.EnumType.SpinSpeed.RPM1400',
        '1600': 'LaundryCare.Washer.EnumType.SpinSpeed.RPM1600'
      }[currentSpin];


      const response = await fetch(`https://simulator.home-connect.com/api/homeappliances/${washingMachineId}/programs/active`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.bsh.sdk.v1+json',
        },
        body: JSON.stringify({
          "data": {
            "key": programKey,
            "options": [
              {
                "key": "LaundryCare.Washer.Option.Temperature",
                "value": temperatureKey
              },
              {
                "key": "LaundryCare.Washer.Option.SpinSpeed",
                "value": spinKey
              }
            ]
          }
        }),
      });

      if (response.status === 204 || response.status === 200) {
        setIsRunning(true);
        const startTime = Date.now();

        const responseGet = await fetch(`https://simulator.home-connect.com/api/homeappliances/${washingMachineId}/programs/active`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.bsh.sdk.v1+json',
          }
        });

        if (responseGet.ok) {
          const data = await responseGet.json();
          const durationOption = data.data.options.find(option => option.key === 'BSH.Common.Option.Duration');
          const duration = durationOption.value * 1000;
          const endTime = new Date(startTime + duration);;
          setEndTime(endTime);
        } else {
          console.log("Error fetching active program details");
        }
      } else {
        console.log("Error starting the washing machine");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleScheduleStart = () => {
    setStartOption('schedule');
    setShowTimePicker(true);
  };

  const handleTimePickerClose = () => {
    setShowTimePicker(false);
  };

  const handleTimePickerConfirm = (selectedTime) => {
    setScheduledTime(selectedTime);
    setDecreaseStartTimeHeight(true);
    setShowTimePicker(false);
  };

  const handleCancelSchedule = () => {
    setStartOption('now');
    setScheduledTime(null);
    setCountdown(null);
    window.localStorage.removeItem('scheduledTime');
    window.localStorage.removeItem('countdown');
  };

  const formatCountdown = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const savedTime = window.localStorage.getItem('scheduledTime');
    const savedCountdown = window.localStorage.getItem('countdown');
    if (savedTime && savedCountdown) {
      const scheduledDate = new Date(savedTime);
      const currentTime = Date.now();
      const countdownDuration = scheduledDate.getTime() - currentTime;

      if (scheduledDate > new Date()) {
        setScheduledTime(scheduledDate);
        setCountdown(Math.min(countdownDuration, parseInt(savedCountdown, 10)));
      } else {
        window.localStorage.removeItem('scheduledTime');
        window.localStorage.removeItem('countdown');
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          const newCountdown = prev - 1000;
          window.localStorage.setItem('countdown', newCountdown);
          if (newCountdown <= 0) {
            clearInterval(timer);
            setCountdown(null);
            window.localStorage.removeItem('scheduledTime');
            window.localStorage.removeItem('countdown');
            startWashingMachine();
            return 0;
          } else {
            return newCountdown;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="washing-machine-container">
      <h1>Washing Machine</h1>

      <div className="image-section">
        <img src={washingMachineImage} alt="Washing Machine" className="centered-image" />
      </div>

      {isRunning && (
        <div className="running-section">
          <h2>Running</h2>
          <p>Current Mode: <strong>{currentMode}</strong></p>
          <p>Temperature: <strong>{currentDegree}°C</strong></p>
          <p>Spin Speed: <strong>{currentSpin} RPM</strong></p>
          <div className="end-time">
            <p>Washing program will end at: <strong>{new Date(endTime).toLocaleTimeString()}</strong></p>
          </div>
        </div>
      )}

      {!isRunning && (
      <>
      <div className={`controls-section ${countdown !== null ? 'blur' : ''}`}>
        <h2>Controls</h2>
          <div>
            <label>Mode:</label>
            <select value={currentMode} onChange={(e) => setCurrentMode(e.target.value)}>
              <option value="Cotton">Cotton</option>
              <option value="EasyCare">Easy Care</option>
              <option value="Mix">Mix</option>
              <option value="DelicatesSilk">Silk</option>
              <option value="Wool">Wool</option>
            </select>
          </div>
          <div>
            <label>Temperature:</label>
            <select value={currentDegree} onChange={(e) => setCurrentDegree(e.target.value)}>
              <option value="20">20°C</option>
              <option value="30°C">30°C</option>
              <option value="40">40°C</option>
              <option value="50">50°C</option>
              <option value="60">60°C</option>
              <option value="70">70°C</option>
              <option value="80">80°C</option>
              <option value="90">90°C</option>
            </select>
          </div>
          <div>
            <label>Spin Speed:</label>
            <select value={currentSpin} onChange={(e) => setCurrentSpin(e.target.value)}>
              <option value="400">400 RPM</option>
              <option value="600">600 RPM</option>
              <option value="800">800 RPM</option>
              <option value="1000">1000 RPM</option>
              <option value="1200">1200 RPM</option>
              <option value="1400">1400 RPM</option>
              <option value="1600">1600 RPM</option>
            </select>
          </div>
        </div>
        <div className={`start-time-section ${countdown !== null ? 'blur' : ''}`}>
            <h2>Start Time</h2>
            <label>
              <input
                type="radio"
                value="now"
                checked={startOption === 'now'}
                onChange={() => {
                  setStartOption('now');
                  setDecreaseStartTimeHeight(false);
                }}
                />
              Start Now
            </label>
            <label>
              <input
                type="radio"
                value="schedule"
                checked={startOption === 'schedule'}
                onChange={handleScheduleStart}                 
                />
              Schedule Start
            </label>
            {startOption === 'schedule' && scheduledTime && (
              <div className="scheduled-time">
                Scheduled Time: {scheduledTime.toLocaleString()}
              </div>
            )}
          </div>

      {showTimePicker && (
        <div>
          <div className="overlay"></div>
          <TimePicker
            onClose={handleTimePickerClose}
            onConfirm={handleTimePickerConfirm}
          />
        </div>
      )}

      {countdown !== null && (
        <div className={`countdown-timer ${countdown !== null ? 'centered-box' : ''}`}>
          <div className="countdown-box">
            Time until start: {formatCountdown(countdown)}
          </div>
        </div>
      )}
      </>
    )}

    <div className="bottom-buttons">
        <button className="bottom-button" onClick={() => setIsRunning(false)}>Back</button>
        <button
          className={`bottom-button ${isRunning ? 'stop-button' : ''}`}
          onClick={countdown !== null ? handleCancelSchedule : handleStartStop}
        >
          {isRunning ? 'Stop' : countdown !== null ? 'Cancel' : startOption === 'schedule' ? 'Schedule Start' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default WashingMachine;
