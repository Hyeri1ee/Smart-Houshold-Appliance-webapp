import {useState} from "react";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/generic/AddButton";
import Checkbox from "../components/generic/Checkbox";
import "../styles/global.css";
import "../styles/schedule/schedule-page-style.css";

// All Day mark has a bug sometimes needs further investigation

const daysOfWeek = [
    { short: "Mo", full: "Monday", id: 0 },
    { short: "Tu", full: "Tuesday", id: 1 },
    { short: "We", full: "Wednesday", id: 2 },
    { short: "Th", full: "Thursday", id: 3 },
    { short: "Fr", full: "Friday", id: 4 },
    { short: "Sa", full: "Saturday", id: 5 },
    { short: "Su", full: "Sunday", id: 6 }
];

function SchedulePage() {
    const [showDaysModal, setShowDaysModal] = useState(false);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [tempSelectedDays, setTempSelectedDays] = useState([]);
    const [dayTimeSlots, setDayTimeSlots] = useState({});
    const [currentDay, setCurrentDay] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [allDay, setAllDay] = useState(false); //  for tracking "All Day" selection
    const navigate = useNavigate();

    const handleAddTimeslot = () => {
        setTempSelectedDays(selectedDays);
        setShowDaysModal(true);
    };

    const handleCloseDaysModal = () => {
        setTempSelectedDays([]);
        setShowDaysModal(false);
    };

    const handleSaveDays = () => {
        setSelectedDays(tempSelectedDays);
        setShowDaysModal(false);
    };

    const handleCloseTimeModal = () => {
        setShowTimeModal(false);
    };

    const handleConfirm = () => {
        console.log("Confirm button clicked");
        // navigate("/confirmation");
        navigate("/dashboard");
    };

    const handleSaveTimeslot = () => {
        // If "All Day" is marked, save "All Day" instead of time slots
        if (allDay) {
            setDayTimeSlots((prevDayTimeSlots) => ({
                ...prevDayTimeSlots,
                [currentDay]: "All Day",
            }));
        } else {
            setDayTimeSlots((prevDayTimeSlots) => ({
                ...prevDayTimeSlots,
                [currentDay]: timeSlots,
            }));
        }
        setShowTimeModal(false);
    };

    const toggleDay = (day) => {
        setTempSelectedDays((prevSelectedDays) =>
            prevSelectedDays.includes(day)
                ? prevSelectedDays.filter((d) => d !== day)
                : [...prevSelectedDays, day]
        );
    };

    const handleTimeChange = (index, field, value) => {
        const newTimeSlots = [...timeSlots];
        newTimeSlots[index][field] = value;
        setTimeSlots(newTimeSlots);
    };

    const handleAddTimeSlot = () => {
        setTimeSlots([...timeSlots, { startTime: "", endTime: "" }]);
    };

    const handleDayModal = (day) => {
        setCurrentDay(day);
        setTimeSlots(dayTimeSlots[day] || [{ startTime: "", endTime: "" }]);
        setShowTimeModal(true);
    };

    function handleAllDay() {
        setAllDay((prevAllDay) => !prevAllDay); // Toggle "All Day" state
        if (!allDay) {
            setTimeSlots([]);
        } else {
            setTimeSlots(dayTimeSlots[currentDay] || []);
        }
    }

    return (
        <div className="app-container">
            <h2 className="fixed-header">When would you like to run your washing machine?</h2>
            <div className="selected-days-container">
                {selectedDays.map((day) => (
                    <div key={day} className="day-box" onClick={() => handleDayModal(day)}>
                        <div className="primary-color">{daysOfWeek.find(d => d.short === day).full}</div>
                        <div className="separator"></div>
                        {dayTimeSlots[day] && typeof dayTimeSlots[day] === 'string' ? (
                            <div className="time-slot-display secondary-color">
                                {dayTimeSlots[day]}
                            </div>
                        ) : (
                            dayTimeSlots[day] && dayTimeSlots[day].map((slot, index) => (
                                <div key={index} className="time-slot-display secondary-color">
                                    {`${slot.startTime} - ${slot.endTime}`}
                                </div>
                            ))
                        )}
                    </div>
                ))}
            </div>
            <div className={`schedule-container ${showDaysModal || showTimeModal ? 'blurred' : ''}`}>
                {/* Content that can be blurred */}
            </div>
            <div className="button-container">
                {/* TODO: it should be "add timeslot for [selected day]" */}
                <button type="button" onClick={handleAddTimeslot}>Add Timeslot</button>
                <button type="button" onClick={handleConfirm}>Confirm</button>
            </div>
            {showDaysModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Choose Days</h3>
                        <form>
                            <div className="day-selector">
                                {daysOfWeek.map((day) => (
                                    <div
                                        key={day.short}
                                        className={`day-circle ${tempSelectedDays.includes(day.short) ? 'selected' : ''}`}
                                        onClick={() => toggleDay(day.short)}
                                    >
                                        {day.short}
                                    </div>
                                ))}
                            </div>
                            <div className="modal-submit-buttons">
                                <button type="button" onClick={handleSaveDays}>Save</button>
                                <button type="button" onClick={handleCloseDaysModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showTimeModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Add Timeslot</h3>
                        <form>
                            <div className="time-slots">
                                {!allDay && timeSlots.map((slot, index) => (
                                    <div key={index} className="time-slot">
                                        <div className="input-group">
                                            <label>Start Time:</label>
                                            <input
                                                type="time"
                                                value={slot.startTime}
                                                onChange={(e) => handleTimeChange(index, "startTime", e.target.value)}
                                            />
                                        </div>
                                        <div className="input-group">
                                        <label>End Time:</label>
                                        <input
                                            type="time"
                                            value={slot.endTime}
                                            onChange={(e) => handleTimeChange(index, "endTime", e.target.value)}
                                        />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div id="add-btn">
                                <AddButton onClick={handleAddTimeSlot}></AddButton>
                            </div>
                            <div id="checkbox-box">
                                <Checkbox onClick={handleAllDay}>Mark all day</Checkbox>
                            </div>
                            <div className="modal-submit-buttons">
                                <button type="button" onClick={handleSaveTimeslot}>Save</button>
                                <button type="button" onClick={handleCloseTimeModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SchedulePage;
