import React, { useState } from 'react';
import "../styles/components/timePicker.css"

const TimePicker = ({ onClose, onConfirm }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());

    const handleDateChange = (e) => {
        setSelectedDate(new Date(e.target.value));
    };

    const handleTimeChange = (e) => {
        setSelectedTime(new Date(e.target.value));
    };

    const handleConfirm = () => {
        const combinedDateTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes()
        );
        onConfirm(combinedDateTime);
    };

    return (
        <div className="time-picker-container">
            <h3>Select Date and Time</h3>
            <div>
                <label>Date:</label>
                <input type="date" value={selectedDate.toISOString().split('T')[0]} onChange={handleDateChange} />
            </div>
            <div>
                <label>Time:</label>
                <input type="time" value={selectedTime.toTimeString().split(' ')[0]} onChange={handleTimeChange} />
            </div>
            <div>
                <button onClick={handleConfirm}>Confirm</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default TimePicker;