import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/schedule/schedule-page-style.css";

const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function SchedulePage() {
    const [showModal, setShowModal] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [time, setTime] = useState("");
    const navigate = useNavigate();

    const handleAddTimeslot = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirm = () => {
        console.log("Confirm button clicked");
        navigate("/confirmation");
    };

    const handleSaveTimeslot = () => {
        console.log("Selected Days:", selectedDays);
        console.log("Time:", time);
        setShowModal(false);
    };

    const toggleDay = (day) => {
        setSelectedDays((prevSelectedDays) =>
            prevSelectedDays.includes(day)
                ? prevSelectedDays.filter((d) => d !== day)
                : [...prevSelectedDays, day]
        );
    };

    return (
        <div className="app-container">
            <h2 className="fixed-header">When would you like to run your washing machine?</h2>
            <div className={`schedule-container ${showModal ? 'blurred' : ''}`}>
                {/* Content that can be blurred */}
            </div>
            <div className="button-container">
                <button type="button" onClick={handleAddTimeslot}>Add Timeslot</button>
                <button type="button" onClick={handleConfirm}>Confirm</button>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Add Timeslot</h3>
                        <form>
                            <div className="day-selector">
                                {daysOfWeek.map((day) => (
                                    <div
                                        key={day}
                                        className={`day-circle ${selectedDays.includes(day) ? 'selected' : ''}`}
                                        onClick={() => toggleDay(day)}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label>Time:</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                            <div className="modal-button-container">
                                <button type="button" onClick={handleSaveTimeslot}>Save</button>
                                <button type="button" onClick={handleCloseModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SchedulePage;
