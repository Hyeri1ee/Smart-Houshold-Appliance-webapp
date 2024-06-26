import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/generic/AddButton";
import RemoveButton from "../components/generic/RemoveButton";
import Checkbox from "../components/generic/Checkbox";
import {getCookie} from "../helpers/CookieHelper";
import "../styles/global.css";
import "../styles/pages/AskTimeslotsPage.css";

const daysOfWeek = [
  { short: "Mo", full: "Monday", id: 0 },
  { short: "Tu", full: "Tuesday", id: 1 },
  { short: "We", full: "Wednesday", id: 2 },
  { short: "Th", full: "Thursday", id: 3 },
  { short: "Fr", full: "Friday", id: 4 },
  { short: "Sa", full: "Saturday", id: 5 },
  { short: "Su", full: "Sunday", id: 6 }
];

function AskTimeslotsPage() {
  const [showDaysModal, setShowDaysModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [tempSelectedDays, setTempSelectedDays] = useState([]);
  const [dayTimeSlots, setDayTimeSlots] = useState({});
  const [currentDay, setCurrentDay] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [allDay, setAllDay] = useState(false); //  for tracking "All Day" selection
  const navigate = useNavigate();
  const userProfileType = null;

  useEffect(() => {
    profileTypeDefault();
  }, []);


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

  const handleConfirm = async() => {
    console.log("Confirm button clicked");
    const auth = getCookie('authorization');

    const getDayNumber = (day) => {
      return daysOfWeek.find(d => d.short === day).id;
    };

    const scheduleData = Object.entries(dayTimeSlots).map(([day, slots]) => ({
      weekday: getDayNumber(day),
      times: slots === "All Day"
        ? [{ start_time: "00:00", end_time: "23:59" }]
        : slots.map(slot => ({
            start_time: slot.startTime,
            end_time: slot.endTime
          }))
    }));

    const resp = await fetch('http://localhost:1337/api/schedule', {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(scheduleData)
    });

    if (!resp.ok) {
      console.error("Fetch failed!");
      return;
    }

    console.log(scheduleData);

  };

  const profileTypeDefault = async () => {
    const accessToken = getCookie('authorization');
    const resp = await fetch('http://localhost:1337/api/schedule', {
      method: 'GET',
      headers: {
        'Authorization': accessToken,
        'Content-Type': 'application/json',
      },
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error("Fetch failed!");
      return;
    }
    defaultSchedule(data.profileType);
  };

  const defaultSchedule =  async (userProfile) => {

    switch( userProfile ) {
      case 0:
        break;
      case 1:
        // Set timeslots and weekday for user profile type 1
        setSelectedDays(prevDays => {
          const newDays = ["Tu", "Fr", "Sa"];
          return [...new Set(newDays)];
        });
        setDayTimeSlots({
        Tu: [{ startTime: "08:00", endTime: "10:00" }, { startTime: "18:00", endTime: "21:00" }],
        Fr: [{ startTime: "08:00", endTime: "10:00" }, { startTime: "18:00", endTime: "21:00" }],
        Sa: [{ startTime: "08:00", endTime: "10:00" }, { startTime: "18:00", endTime: "21:00" }],
      });
      break;

      case 2:
        // Set timeslots and weekday for user profile type 2
        setSelectedDays(prevDays => {
          const newDays = ["Tu", "Fr", "Sa"];
          return [...new Set(newDays)];
        });
        setDayTimeSlots({
          Tu: [{ startTime: "08:00", endTime: "21:00" }],
          Fr: [{ startTime: "08:00", endTime: "21:00" }],
          Sa: [{ startTime: "08:00", endTime: "21:00" }],
        });
        break;

      case 3:
        // Set timeslots and weekday for user profile type 3
        setSelectedDays(prevDays => {
          const newDays = ["Mo","We","Fr","Sa", "Su"];
          return [...new Set(newDays)];
        });
        setDayTimeSlots({
          Mo: [{ startTime: "07:00", endTime: "22:00" }],
          We: [{ startTime: "07:00", endTime: "22:00" }],
          Fr: [{ startTime: "07:00", endTime: "22:00" }],
          Sa: [{ startTime: "07:00", endTime: "22:00" }],
          Su: [{ startTime: "07:00", endTime: "22:00" }],
        });
        break;
    }
  };

  const handleSaveTimeslot = async () => {
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

    const auth = getCookie('authorization');

    const getDayNumber = (day) => {
      return daysOfWeek.find(d => d.short === day).id;
    };

    const scheduleData = Object.entries(dayTimeSlots).map(([day, slots]) => ({
      weekday: getDayNumber(day),
      times: slots === "All Day"
        ? [{ start_time: "00:00", end_time: "23:59" }]
        : slots.map(slot => ({
            start_time: slot.startTime,
            end_time: slot.endTime
          }))
    }));

    const resp = await fetch(`${import.meta.env.VITE_REACT_APP_SERVER}/api/user/timeslots`, {
      method: 'PUT',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(scheduleData)
    });
    
    if (!resp.ok) {
      console.error("Fetch failed!");
    }

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

  const handleRemoveTimeSlot = (index) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots.splice(index, 1);
    setTimeSlots(newTimeSlots);
  };

  const handleDayModal = (day) => {
    setCurrentDay(day);
    setTimeSlots(dayTimeSlots[day] || [{ startTime: "", endTime: "" }]);
    setShowTimeModal(true);
  };

  const handleAllDay = () => {
    setAllDay((prevAllDay) => !prevAllDay);
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
            {/* TODO: it should be "add timeslot for [selected day]" */}
            <h3>Add Timeslot</h3>
            <form>
              <div className="time-slots">
                {!allDay && timeSlots.map((slot, index) => (
                  <div key={index} className="time-slot">
                    <div className="inputs">
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
                    <RemoveButton onRemove={handleRemoveTimeSlot} index={index} />
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

export default AskTimeslotsPage;