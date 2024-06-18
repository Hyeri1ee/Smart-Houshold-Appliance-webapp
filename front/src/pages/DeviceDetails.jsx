import React, { useState, useEffect } from 'react';
import '../styles/pages/Washing.css';
import washingMachineImage from "../assets/device/machine.png";
import TimePicker from '../components/generic/TimePicker';

const WashingMachine = () => {
  const [startOption, setStartOption] = useState('now');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMode, setCurrentMode] = useState('Cotton');
  const [currentDegree, setCurrentDegree] = useState('40');
  const [currentSpin, setCurrentSpin] = useState('1000');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [fetchTimerActive, setFetchTimerActive] = useState(false);

  const washingMachineId = 'SIEMENS-HCS03WCH1-7BC6383CF794';

  useEffect(() => {
    let interval = null;

    const fetchActiveProgram = async () => {
      try {
        const accessToken = window.sessionStorage.getItem('homeconnect_simulator_auth_token');
        const response = await fetch(`https://simulator.home-connect.com/api/homeappliances/${washingMachineId}/programs/active`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.bsh.sdk.v1+json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          const durationOption = data.data.options.find(option => option.key === 'BSH.Common.Option.Duration');
          const programDuration = durationOption ? durationOption.value : null;

          if (isRunning && programDuration) {
            const intervalDuration = programDuration * 1000 / 100;

            interval = setInterval(() => {
              setProgress(prev => {
                if (prev < 100) {
                  return prev + 1;
                } else {
                  clearInterval(interval);
                  setIsRunning(false);
                  return 0;
                }
              });
            }, intervalDuration);
          }
        } else {
          console.error('Error fetching active program:', response.status);
        }
      } catch (error) {
        console.error('Error fetching active program:', error);
      }
    };

    if (fetchTimerActive) {
      fetchActiveProgram();
      setFetchTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [fetchTimerActive, isRunning, washingMachineId]);

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
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
        setProgress(0);
      } else {
        console.error("Error starting the washing machine");
      }
    } catch (error) {
      console.error("Error starting the washing machine:", error);
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
    setShowTimePicker(false);
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
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-percentage">{progress}%</span>
          </div>
        </div>
      )}

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
            <option value="40°C">40°C</option>
            <option value="50°C">50°C</option>
            <option value="60°C">60°C</option>
            <option value="70°C">70°C</option>
            <option value="80°C">80°C</option>
            <option value="90°C">90°C</option>
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
            onChange={() => setStartOption('now')}
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

      {startOption === 'schedule' && scheduledTime && (
        <div className="scheduled-time">
          Scheduled Time: {scheduledTime.toLocaleString()}
        </div>
      )}

      {countdown !== null && (
        <div className="countdown-timer">
          Time until start: {Math.floor(countdown / 1000)} seconds
        </div>
      )}

      <div className="bottom-buttons">
        <button className="bottom-button" onClick={() => setIsRunning(false)}>Back</button>
        <button
          className={`bottom-button ${isRunning ? 'stop-button' : ''}`}
          onClick={handleStartStop}
        >
          {isRunning ? 'Stop' : startOption === 'schedule' ? 'Schedule Start' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default WashingMachine;
