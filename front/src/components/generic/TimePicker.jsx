import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import '../../styles/components/TimePicker.css';
import { format, isToday, addMinutes } from 'date-fns';
import PropTypes from 'prop-types';

const TimePicker = ({ onClose, onConfirm }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(addMinutes(new Date(), 1)); // Default to 1 minute ahead of now

    const handleDateChange = (date) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    const handleTimeChange = (e) => {
        const [hours, minutes] = e.target.value.split(':');
        const newTime = new Date(selectedTime);
        newTime.setHours(hours, minutes);
        setSelectedTime(newTime);
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
            <h3 className="time-picker-heading">Select Date and Time</h3>
            <div className="date-picker-container">
                <label className="date-label">Date:</label>
                <DayPicker
                    mode="single"
                    selected={selectedDate}  /*  */
                    onSelect={handleDateChange}
                    disabled={{ before: new Date().setHours(0, 0, 0, 0) }} // Disable all past dates
                />
            </div>
            <div className="time-input-container">
                <label className="time-label">Time:</label>
                <input
                    className="time-input"
                    type="time"
                    value={format(selectedTime, 'HH:mm')}
                    onChange={handleTimeChange}
                    min={isToday(selectedDate) ? format(new Date(), 'HH:mm') : '00:00'} // Disable past times if today is selected
                />
            </div>
            <div className="button-container">
                <button className="confirm-button" onClick={handleConfirm}>Confirm</button>
                <button className="cancel-button" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

TimePicker.propTypes = {
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};

export default TimePicker;