import { useState, useEffect, useContext } from 'react';
import '../styles/pages/DeviceDetails.css';
import washingMachineImage from "../assets/device/machine.png";
import TimePicker from '../components/generic/TimePicker';
import { GlobalStateContext } from '../components/generic/GlobalStateContext';

const DeviceDetails = () => {
  const accessToken = window.sessionStorage.getItem('homeconnect_simulator_auth_token');
  const { washingMachineId, setwashingMachineId, programs, setPrograms } = useContext(GlobalStateContext);
  const [startOption, setStartOption] = useState('now');
  const [isRunning, setIsRunning] = useState(() => {
    const saved = window.sessionStorage.getItem('isRunning');
    return saved ? JSON.parse(saved) : false;
  });
  const [currentMode, setCurrentMode] = useState(() => window.sessionStorage.getItem('currentMode') || '');
  const [currentDegree, setCurrentDegree] = useState(() => window.sessionStorage.getItem('currentDegree') || '');
  const [currentSpin, setCurrentSpin] = useState(() => window.sessionStorage.getItem('currentSpin') || '');
  const [endTime, setEndTime] = useState(() => {
    const saved = window.sessionStorage.getItem('endTime');
    return saved ? new Date(saved) : null;
  });
  const [decreaseStartTimeHeight, setDecreaseStartTimeHeight] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [scheduledTime, setScheduledTime] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [washerInterval] = useState(30000);

  useEffect(() => {
    // check if the current time is past the end time
    if (endTime && new Date() > endTime) {
      setIsRunning(false);
      window.sessionStorage.removeItem('endTime');
    } else if (endTime) {
      setIsRunning(true);
    }
  }, [endTime]);

  useEffect(() => {
    //check if there is already a stored washingMachineId
    if (!washingMachineId) {
      const fetchData = async () => {
        try {
          const response = await fetch(`https://simulator.home-connect.com/api/homeappliances`, {
            method: 'GET',
            headers: {
              'Authorization': `${accessToken}`,
              'Content-Type': 'application/json',
              'Accept': 'application/vnd.bsh.sdk.v1+json',
            }
          });

          if (response.status === 200) {
            const data = await response.json();
            //only grab the washing machine
            const washer = data.data.homeappliances.find(appliance => appliance.name === "Washer Simulator");

            if (washer) {
              setwashingMachineId(washer.haId);
              // fetch all washing machine available programs
              const programsResponse = await fetch(`https://simulator.home-connect.com/api/homeappliances/${washer.haId}/programs/available`, {
                method: 'GET',
                headers: {
                  'Authorization': `${accessToken}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/vnd.bsh.sdk.v1+json',
                }
              });

              if (programsResponse.status === 200) {
                const programsData = await programsResponse.json();
                const programKeys = programsData.data.programs.map(program => program.key);

                const tempPrograms = [];
                // fetch all settings for all programs
                for (let programKey of programKeys) {
                  const programResponse = await fetch(`https://simulator.home-connect.com/api/homeappliances/${washer.haId}/programs/available/${programKey}`, {
                    method: 'GET',
                    headers: {
                      'Authorization': `${accessToken}`,
                      'Content-Type': 'application/json',
                      'Accept': 'application/vnd.bsh.sdk.v1+json',
                    }
                  });

                  if (programResponse.status === 200) {
                    const programData = await programResponse.json();
                    const options = programData.data.options.map(option => ({
                      optionKey: option.key,
                      allowedValues: option.constraints.allowedvalues
                    }));

                    tempPrograms.push({
                      programKey,
                      options
                    });
                  } else {
                    console.error(`error retrieving details for program ${programKey}`);
                  }
                }

                setPrograms(tempPrograms);
                //set the first program as the default selection
                if (tempPrograms.length > 0) {
                  setCurrentMode(tempPrograms[0].programKey);
                }
              } else {
                console.error("error retrieving program keys");
              }
            } else {
              console.error("Washer not found");
            }
          } else {
            console.error("error retrieving washingMachineId");
          }
        } catch (error) {
          console.error("error retrieving data:");
        }
      };

      fetchData();
    }
  }, [washingMachineId, setwashingMachineId, setPrograms, accessToken]);

  useEffect(() => {
    console.log('programs:', programs);
  }, [programs]);

  useEffect(() => {
    if (programs.length > 0) {
      //set first program and related settings as default values to be displayed in dropdown
      setCurrentMode(programs[0].programKey);

      if (programs[0].options.length > 0) {
        const firstOptions = programs[0].options;

        if (firstOptions[0].allowedValues.length > 2) {
          setCurrentDegree(firstOptions[0].allowedValues[2]);
        }

        if (firstOptions.length > 1 && firstOptions[1].allowedValues.length > 0) {
          setCurrentSpin(firstOptions[1].allowedValues[0]);
        }
      }
    }
  }, [programs]);

  const reduceStartTimeSectionHeight = () => {
    const element = document.querySelector('.start-time-section');
    if (element) {
      element.classList.add('adjusted');
    }
  }

  const increaseStartTimeSectionHeight = () => {
    const element = document.querySelector('.start-time-section');
    if (element) {
      element.classList.remove('adjusted');
    }
  }

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

  const fetchWasherStatus = async () => {
    try {
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
        window.sessionStorage.removeItem('isRunning');
        window.sessionStorage.removeItem('endTime');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const stopWashingMachine = async () => {
    try {
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
        window.sessionStorage.removeItem('isRunning');
        window.sessionStorage.removeItem('endTime');
      } else {
        console.log("Error stopping the washing machine");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (decreaseStartTimeHeight) {
      reduceStartTimeSectionHeight();
    } else {
      increaseStartTimeSectionHeight();
    }
  }, [decreaseStartTimeHeight]);

  useEffect(() => {
    const statusInterval = setInterval(() => {
      fetchWasherStatus();
    }, washerInterval);

    return () => clearInterval(statusInterval);
  }, [washerInterval, fetchWasherStatus]);

  const startWashingMachine = async () => {
    const startTime = Date.now();
    try {
      const selectedProgram = programs.find(program => program.programKey === currentMode);
      const temperatureKey = selectedProgram.options.find(option => option.optionKey === 'LaundryCare.Washer.Option.Temperature').allowedValues.find(value => value === currentDegree);
      const spinKey = selectedProgram.options.find(option => option.optionKey === 'LaundryCare.Washer.Option.SpinSpeed').allowedValues.find(value => value === currentSpin);

      const response = await fetch(`https://simulator.home-connect.com/api/homeappliances/${washingMachineId}/programs/active`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.bsh.sdk.v1+json',
        },
        body: JSON.stringify({
          "data": {
            "key": currentMode,
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
        window.sessionStorage.setItem('isRunning', JSON.stringify(true));
        window.sessionStorage.setItem('currentMode', currentMode);
        window.sessionStorage.setItem('currentDegree', currentDegree);
        window.sessionStorage.setItem('currentSpin', currentSpin);
        const endTime = new Date(startTime + 360 * 1000); // 6 mins
        setEndTime(endTime);
        window.sessionStorage.setItem('endTime', endTime.toISOString());
      } else {
        console.error("Error starting the washing machine: " + response.statusText);
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
    setDecreaseStartTimeHeight(false);
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
  }, [countdown, startWashingMachine]);

  // what is displayed on the temperature and spin dropdown values depends on the program selected from the mode dropdown
  const handleModeChange = (e) => {
    const selectedMode = e.target.value;
    setCurrentMode(selectedMode);
    const selectedProgram = programs.find(program => program.programKey === selectedMode);
    if (selectedProgram) {
      setCurrentDegree(selectedProgram.options.find(option => option.optionKey === 'LaundryCare.Washer.Option.Temperature').allowedValues[0]);
      setCurrentSpin(selectedProgram.options.find(option => option.optionKey === 'LaundryCare.Washer.Option.SpinSpeed').allowedValues[0]);
    }
  };

  const selectedProgram = programs.find(program => program.programKey === currentMode);
  const temperatureOptions = selectedProgram ? selectedProgram.options.find(option => option.optionKey === 'LaundryCare.Washer.Option.Temperature').allowedValues : [];
  const spinOptions = selectedProgram ? selectedProgram.options.find(option => option.optionKey === 'LaundryCare.Washer.Option.SpinSpeed').allowedValues : [];

  const formatCamelCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  return (
    <div className="washing-machine-container">
      <h1>Washing Machine</h1>

      <div className="image-section">
        <img src={washingMachineImage} alt="Washing Machine" className="centered-image" />
      </div>

      {isRunning && (
        <div className="running-section">
          <h2>Running</h2>
          <div className='started-setting-container'>
            <div className='label-box'>
              <label>Current Mode:</label>
            </div>
            <div className='started-setting-p'>
            <p>{formatCamelCase((window.sessionStorage.getItem('currentMode')).split('.').slice(3).join('.'))}</p>
          </div>
            </div>
          <div className='started-setting-container'>
            <div className='label-box'>
              <label>Temperature:</label>
            </div>
            <div className='started-setting-p'>
              <p>{currentDegree !== 'LaundryCare.Washer.EnumType.Temperature.Cold' ? currentDegree.split('.').slice(4).join('.').replace(/^GC/, '') + '°C' : 'Cold'}</p>
            </div>
          </div>
          <div className='started-setting-container'>
            <div className='label-box'>
              <label>Spin speed:</label>
            </div>
            <div className='started-setting-p'>
              <p>{currentSpin !== 'LaundryCare.Washer.EnumType.SpinSpeed.Off' ? currentSpin.split('.').slice(4).join('.').replace(/^RPM/, '') + ' RPM' : 'Off'}</p>
            </div>
          </div>
          <div className='started-setting-container end-time'>
            <div className='label-box'>
              <label>End time:</label>
            </div>
            <div className='started-setting-p'>
              <p>{new Date(endTime).toLocaleTimeString()}</p>
              </div>
          </div>
        </div>
      )}

      {!isRunning && (
        <>
          <div className={`controls-section ${countdown !== null ? 'blur' : ''}`}>
            <h2>Controls</h2>
            <div className='setting-container'>
              <div className='label-box'>
                <label>Mode:</label>
              </div>
              <select value={currentMode} onChange={handleModeChange}>
                {programs.map((program) => (
                  <option key={program.programKey} value={program.programKey}>{formatCamelCase(program.programKey.split('.').slice(3).join('.'))}</option>
                ))}
              </select>
            </div>
            <div className='setting-container'>
              <div className='label-box'>
                <label>Temperature:</label>
              </div>
              <select value={currentDegree} onChange={(e) => setCurrentDegree(e.target.value)}>
                {temperatureOptions.map((temp) => (
                  <option key={temp} value={temp}>
                    {temp !== 'LaundryCare.Washer.EnumType.Temperature.Cold' ? temp.split('.').slice(4).join('.').replace(/^GC/, '') + '°C' : 'Cold'}
                  </option>
                ))}
              </select>
            </div>
            <div className='setting-container'>
              <div className='label-box'>
                <label>Spin Speed:</label>
              </div>
              <select value={currentSpin} onChange={(e) => setCurrentSpin(e.target.value)}>
                {spinOptions.map((spin) => (
                  <option key={spin} value={spin}>
                    {spin !== 'LaundryCare.Washer.EnumType.SpinSpeed.Off' ? spin.split('.').slice(4).join('.').replace(/^RPM/, '') + ' RPM' : 'Off'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={`start-time-section ${countdown !== null ? 'blur' : ''}`}>
            <h2>Start Time</h2>
            <div id='radio-group'>
              <div className='radio-box'>
                <div>
                  <input
                    type="radio"
                    value="now"
                    checked={startOption === 'now'}
                  />
                </div>
                <label>Start Now</label>
              </div>
              <div className='radio-box'>
                <div>
                  <input
                    type="radio"
                    value="schedule"
                    checked={startOption === 'schedule'}
                    onChange={handleScheduleStart}
                  />
                </div>
                <label>Schedule Start</label>
              </div>
              {startOption === 'schedule' && scheduledTime && (
                <div className="scheduled-time">
                  Scheduled Time: {scheduledTime.toLocaleString()}
                </div>
              )}
            </div>
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

        {/* TODO:
        //Countdown is never null, so something here is wrong! */}
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
        <button
          className={`bottom-button ${isRunning ? 'stop-button' : 'start-button'}`}
          onClick={countdown !== null ? handleCancelSchedule : handleStartStop}
        >
          {isRunning ? 'Stop' : countdown !== null ? 'Cancel' : startOption === 'schedule' ? 'Schedule Start' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default DeviceDetails;