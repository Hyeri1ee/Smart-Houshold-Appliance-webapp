import React, { useState, useEffect } from 'react';
import '../styles/components/washing.css';
import washingMachineImage from "../../public/machine.png";
import TimePicker from '../components/TimePicker';

const WashingMachine = () => {
    const [startOption, setStartOption] = useState('now');
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentMode, setCurrentMode] = useState('Cotton eco');
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [scheduledTime, setScheduledTime] = useState(null);

    useEffect(() => {
        let interval = null;
        if (isRunning) {
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
            }, 100); // Increment progress every 100ms
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const handleStartStop = () => {
        if (isRunning) {
            setIsRunning(false);
        } else {
            setIsRunning(true);
            setProgress(0);
        }
    };

    const handleScheduleStart = () => {
        setStartOption('schedule');
        setShowTimePicker(true); // Show the time picker component
    };

    const handleTimePickerClose = () => {
        setShowTimePicker(false);
    };

    const handleTimePickerConfirm = (selectedTime) => {
        setScheduledTime(selectedTime);
        setShowTimePicker(false);
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
                    <p>Current Mode: <strong>{currentMode}</strong></p>
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="progress-percentage">{progress}%</span>
                    </div>
                </div>
            )}

            <div className={`controls-section ${isRunning ? 'blur' : ''}`}>
                <h2>Controls</h2>
                <button className="control-button" onClick={() => setCurrentMode('Cotton eco')}>Cotton eco</button>
                <button className="control-button" onClick={() => setCurrentMode('40 Deg')}>40 Deg</button>
                <button className="control-button" onClick={() => setCurrentMode('Off')}>Off</button>
            </div>

            <div className={`start-time-section ${isRunning ? 'blur' : ''}`}>
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

            <div className="bottom-buttons">
                <button className="bottom-button" onClick={() => setIsRunning(false)}>Back</button>
                <button
                    className={`bottom-button ${isRunning ? 'stop-button' : ''}`}
                    onClick={handleStartStop}
                >
                    {isRunning ? 'Stop' : 'Start'}
                </button>
            </div>
        </div>
    );
};

export default WashingMachine;
