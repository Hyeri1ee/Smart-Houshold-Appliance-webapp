import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/global.css";
import "../styles/schedule/schedule-page-style.css";

function SchedulePage() {
    const [showModal, setShowModal] = useState(false);
    const [date, setDate] = useState("");
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
        console.log("Date:", date);
        console.log("Time:", time);
        setShowModal(false);
    };

    return (
        <div className="app-container">
            <div className={`schedule-container ${showModal ? 'blurred' : ''}`}>
                <h2>When would you like to run your washing machine?</h2>
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
                            <div>
                                <label>Date:</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
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
